import readline, {Interface} from "readline";
import {existsSync, promises as fs} from "fs";
import {flatten} from "lodash";
import {decrypt, encrypt} from "./encryptDecrypt";
import {
	ConfigWithStoreParameters,
	DashboarConfig,
	SourceEnvironmentSchema,
	SourcePromptSchema,
	SourceSchema,
	StoreParameterObjectSchema,
	StoreParameterSchema,
	StoreValues,
	StringOrStringFunc
} from "./config";
import dotenv from "dotenv";
import debug from 'debug';


const d = debug('resolve-store-values');

dotenv.config();

const storeFilePath = "dashboar-store";

const resolveStringFunc = (s: StringOrStringFunc) => {
	return typeof s === 'function' ? s() : s;
}

/**
 * I wonder if this should be a global
 * I think it should be, because it has to be closed later
 */
const getCommandPromptInterface = () => readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Prompts the user for a new dashboar-store password
const getStorePassword = async ({cli, prompt}: {cli: Interface, prompt: string}) => {
	return new Promise<string>((resolve, reject) => {
		cli.question(prompt, async (pw: string) => {
			if (!pw.length) reject("Store password cannot be empty");
			else {
				if (!existsSync(storeFilePath)) console.log(`Created ${storeFilePath}`);
				resolve(pw);
			}
		});
	});
};

// Prompts the user for values based off the questions in the config file
const promptUserForValue = async ({cli, prompt}:{cli: Interface, prompt: string | (() => string)}) => {
	// Call this until the answer is not blank.
	// TODO: Add ways for the user to cancel/skip this value
	const askForValue = () => new Promise<string>((resolve) => {
		cli.question((typeof prompt === 'string') ? prompt : prompt(), async (answer: string) => {
			// TODO add logic for number/string prompts too
			resolve(answer);
		});
	});
	let value: string = "";
	while (!value) {
		value = await askForValue();
		if (!value) {
			console.log("Value not provided")
		}
	}
	return value;
};

const readStoreFromEncryptedFile = async ({cli}:{cli: Interface}): Promise<{ storeValues: StoreValues, password: string }> => {
	/**
	 * The flat key/value pairs which which are resolved by loading the store file and prompting if necessary
	 */
	let password = "";
	let decryptedData = null;
	while (decryptedData === null) {
		password = await getStorePassword({cli, prompt: `What is the password for ${storeFilePath}?`});
		const storeFileBytes = await fs.readFile(storeFilePath);
		const encryptedData = storeFileBytes.toString().replace(/['"]+/g, "");
		decryptedData = decrypt(password, encryptedData);
		if (decryptedData === null) {
			console.log(`Invalid store password for ${storeFilePath}`)
		}
	}
	const storeValues: StoreValues = JSON.parse(decryptedData);
	return {storeValues, password}
};

const readStoreFromPlainFile = async () => {
	const text = (await fs.readFile(storeFilePath)).toString();
	let parse = JSON.parse(text);
	return parse
}

type StoreParameterConfiguration = { storeParameterKey: string, storeParameterSchema: StoreParameterSchema, configKey: string };

const getSourcePromptType = (sourceSchema: SourceSchema) => ({
	sourceIsPromptString: typeof sourceSchema === 'string',
	sourceIsPromptFunction: typeof sourceSchema === 'function',
	sourceIsPromptObject: Boolean((sourceSchema as SourcePromptSchema).prompt)
});

export const resolveAllStoreValues = async (
	{
		currentStore,
		config: {
			pullRequestConfigs,
			repeatCommands,
			sshTunnels,
			postgresqlConnections
		},
		cli,
	}: { currentStore: StoreValues, config: DashboarConfig, cli: Interface }): Promise<StoreValues> => {
	// @ts-ignore
	const configLists: ConfigWithStoreParameters<{}>[] = flatten([pullRequestConfigs, repeatCommands, sshTunnels, postgresqlConnections].filter(v => Boolean(v)));
	const storeValueSchemas: StoreParameterConfiguration[] = flatten(configLists
		.map((v: ConfigWithStoreParameters<{}>) => {
		return Object.entries(v.storeParameters).map(([storeParameterKey, storeParameterSchema]) => ({
			storeParameterKey,
			storeParameterSchema,
			configKey: v.configKey
		} as StoreParameterConfiguration))
	}));
	for (let i = 0; i < storeValueSchemas.length; i++) {
		const storeParameterConfiguration = storeValueSchemas[i] as StoreParameterConfiguration;
		d(JSON.stringify(storeParameterConfiguration, null, '\t'));
		const { storeParameterKey, storeParameterSchema, configKey } = storeParameterConfiguration;

		const sources = (storeParameterSchema as StoreParameterObjectSchema).sources || storeParameterSchema as StringOrStringFunc;
		/**
		 * See if this parameter can be obtained from different sources, like the environment
		 */
		const sourcesList: SourceSchema[] = Array.isArray(sources) ? sources : [sources];
/*
		if (!sources || !sources.length) {
			sources = [ConfigSources.Prompt];
		}
*/
		/**
		 * Initialize the config namespace in the object (Like all the key/values for the database connection)
		 */
		if (!currentStore[configKey]) {
			currentStore[configKey] = {};
		}
		// @ts-ignore
		if (currentStore[configKey][storeParameterKey]) {
			console.log(`Using existing value for ${storeParameterKey}`);
		} else {
			for (let j = 0; j < sourcesList.length; j++) {
				const sourcesListElement = sourcesList[j] as SourceSchema;
				const {sourceIsPromptString, sourceIsPromptFunction, sourceIsPromptObject} = getSourcePromptType(sourcesListElement);
				const isPrompt = sourceIsPromptObject || sourceIsPromptFunction || sourceIsPromptString;
				const isEnvironment = (sourcesListElement as SourceEnvironmentSchema).envKey;
				if (isPrompt) {
					let promptString = '';
					if (sourceIsPromptObject) {
						promptString = resolveStringFunc((sourcesListElement as SourcePromptSchema).prompt);
					} else {
						promptString = resolveStringFunc(sourcesListElement as StringOrStringFunc)
					}
					// @ts-ignore
					currentStore[configKey][storeParameterKey] = await promptUserForValue({cli, prompt: typeof storeParameterSchema === 'string' ? storeParameterSchema :
							promptString
					});
					// Leave the loop, once we get a result from the user
					break;
				}
				if (isEnvironment) {
					const environmentValue = process.env[(sourcesListElement as SourceEnvironmentSchema).envKey];
					// @ts-ignore
					currentStore[configKey][storeParameterKey] = environmentValue;
					if (!environmentValue) {
						console.log(`Could not find an environment value for ${environmentValue}`);
					}else {
						break;
					}
				}
			}

		}
	}
	console.log(JSON.stringify(currentStore, null, '  '))
	return currentStore;
}

export const saveEncryptedStore = async ({storeValues, password}:{storeValues: StoreValues, password: string}) => {
	const encryptedData = encrypt(password, JSON.stringify(storeValues));
	await fs.writeFile(storeFilePath, JSON.stringify(encryptedData));
}
export const savePlaintextStore = async ({storeValues}:{storeValues: StoreValues }) => {
	await fs.writeFile(storeFilePath, JSON.stringify(storeValues));
}

async function resolveEncryptedStoreFile(storeFileExists: boolean, cli: Interface, config: DashboarConfig) {
	if (storeFileExists) {
		const {storeValues: existingStore, password} = await readStoreFromEncryptedFile({cli});
		const storeValues = await resolveAllStoreValues({currentStore: existingStore, config, cli});
		await saveEncryptedStore({storeValues, password})
		return storeValues;
	} else {
		const storeValues = await resolveAllStoreValues({config, currentStore: {}, cli});
		await saveEncryptedStore({
			storeValues,
			password: await getStorePassword({cli, prompt: `Set the password for ${storeFilePath}`})
		})
		return storeValues;
	}
}

export const resolveStoreValues = async ({config, storeFileIsEncrypted}:{config: DashboarConfig, storeFileIsEncrypted: boolean}) => {
	const cli = getCommandPromptInterface();
	const storeFileExists = existsSync(storeFilePath);
	if (storeFileIsEncrypted) {
		return await resolveEncryptedStoreFile(storeFileExists, cli, config);
	}
	return await resolvePlainStoreFile({storeFileExists, cli, config})
};

async function resolvePlainStoreFile({storeFileExists, cli, config}:{storeFileExists: boolean, cli: Interface, config: DashboarConfig}) {
	if (storeFileExists) {
		const existingStore = await readStoreFromPlainFile();
		const storeValues = await resolveAllStoreValues({currentStore: existingStore, config, cli});
		await savePlaintextStore({storeValues})
		return storeValues;
	} else {
		const storeValues = await resolveAllStoreValues({config, currentStore: {}, cli});
		await savePlaintextStore({storeValues})
		return storeValues;
	}
}
