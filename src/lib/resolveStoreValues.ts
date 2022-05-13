import {Interface} from "readline";
import {existsSync} from "fs";
import {flatten} from "lodash";
import {
	ConfigWithStoreParameters,
	SourceEnvironmentSchema,
	SourcePromptSchema,
	SourceSchema,
	StoreParameterObjectSchema,
	StoreValues,
	StringOrStringFunc
} from "./config";
import dotenv from "dotenv";
import debug from 'debug';
import {resolveStringFunc} from "./resolveStringFunc";
import {getCommandPromptInterface} from "./getCommandPromptInterface";
import {promptUserForValue} from "./promptUserForValue";
import {getSourcePromptType} from "./getSourcePromptType";
import {StoreParameterConfiguration} from "./storeParameterConfiguration";
import {resolveEncryptedStoreFile} from "./resolveEncryptedStoreFile";
import {resolvePlainStoreFile} from "./resolvePlainStoreFile";
import {DashboarConfig} from "./DashboarConfig";


const d = debug('resolve-store-values');

dotenv.config();

export const encryptedStoreFilePath = "dashboar-store";
export const plainStoreFilePath = 'dashboar-store.json';

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
				const envKey = (sourcesListElement as SourceEnvironmentSchema).envKey;
				const isEnvironment = Boolean(envKey);
				if (isPrompt) {
					let promptString = '';
					if (sourceIsPromptObject) {
						promptString = resolveStringFunc((sourcesListElement as SourcePromptSchema).prompt);
					} else {
						promptString = resolveStringFunc(sourcesListElement as StringOrStringFunc)
					}
					const promptResult = await promptUserForValue({
						cli,
							prompt: typeof storeParameterSchema === 'string' ? storeParameterSchema :
							promptString,
							valueType: (sourcesListElement as SourcePromptSchema).type,
					});
					// @ts-ignore
					currentStore[configKey][storeParameterKey] = Number.isNaN(Number(promptResult)) ? promptResult : Number(promptResult);
					// Leave the loop, once we get a result from the user
					break;
				}
				if (isEnvironment) {
					const environmentValue = process.env[envKey];
					// @ts-ignore
					currentStore[configKey][storeParameterKey] = environmentValue;
					if (!environmentValue) {
						console.log(`Could not find an environment value for ${envKey}`);
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

export const resolveStoreValues = async ({config, storeFileIsEncrypted}:{config: DashboarConfig, storeFileIsEncrypted: boolean}) => {
	const cli = getCommandPromptInterface();
	const storeFileExists = existsSync(storeFileIsEncrypted ? encryptedStoreFilePath : plainStoreFilePath);
	if (storeFileIsEncrypted) {
		return await resolveEncryptedStoreFile(storeFileExists, cli, config);
	}
	return await resolvePlainStoreFile({storeFileExists, cli, config})
};

