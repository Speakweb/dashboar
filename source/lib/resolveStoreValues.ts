import readline from "readline";
import {promises as fs, existsSync} from "fs";
import {flatten} from 'lodash';
import {encrypt, decrypt} from "./encryptDecrypt";
import {
	StoreParameterSchema,
	DashboarConfig,
	StoreValues,
	ConfigWithStoreParameters
} from "./config";
import {Interface} from 'readline';

const storeFilePath = "dashboar-store";

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

const loadStoreFromFile = async ({cli}:{cli: Interface}): Promise<{ storeValues: StoreValues, password: string }> => {
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

type StoreParameterConfiguration = { storeParameterKey: string, storeParameterSchema: StoreParameterSchema, configKey: string };
export const resolveAllStoreValues = async (
	{
		currentStore,
		config: {
			pullRequestConfigs,
			repeatCommands,
			sshTunnels,
			postgresqlConnections
		},
		cli
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
		const { storeParameterKey, storeParameterSchema, configKey } = storeValueSchemas[i] as StoreParameterConfiguration;
		if (!currentStore[configKey]) {
			currentStore[configKey] = {};
		}
		// @ts-ignore
		if (currentStore[configKey][storeParameterKey]) {
			console.log(`Using existing value for ${storeParameterKey}`);
		} else {
			// @ts-ignore
			currentStore[configKey][storeParameterKey] = await  promptUserForValue({cli, prompt: typeof storeParameterSchema === 'string' ? storeParameterSchema :
					typeof storeParameterSchema.prompt === 'string' ? storeParameterSchema.prompt : storeParameterSchema.prompt()
			});
		}
	}
	// Remove this because it prints all our encrypted values lol
	console.log(JSON.stringify(currentStore, null, '  '))
	return currentStore;
}

export const saveStore = async ({storeValues, password}:{storeValues: StoreValues, password: string}) => {
	const encryptedData = encrypt(password, JSON.stringify(storeValues));
	await fs.writeFile(storeFilePath, JSON.stringify(encryptedData));
}

export const resolveStoreValues = async (config: DashboarConfig) => {
	const cli = getCommandPromptInterface();
	const storeFileExists = existsSync(storeFilePath);

	if (storeFileExists) {
		const {storeValues: existingStore, password} = await loadStoreFromFile({cli});
		const storeValues = await resolveAllStoreValues({currentStore: existingStore, config, cli});
		await saveStore({storeValues, password})
		return storeValues;
	} else {
		const storeValues = await resolveAllStoreValues({config, currentStore: {}, cli});
		await saveStore({storeValues, password: await getStorePassword({cli, prompt: `Set the password for ${storeFilePath}`})})
		return storeValues;
	}
};
