export enum ConfigSources {
	Environment= "Environment",
	Prompt="Prompt",
}

export type StringOrStringFunc = string | (() => string);

export type SourceEnvironmentSchema = {
	sourceType: ConfigSources.Environment
	envKey: string
}

export type SourcePromptSchema = {
	type?: "string" | "number";
	sourceType: ConfigSources.Prompt;
	prompt: string | (() => string)
}
/**
 * StringOrStringFunc
 */
export type SourceSchema = SourceEnvironmentSchema | SourcePromptSchema | StringOrStringFunc;// TODO add more SourceObjectSchemaTypes

export type StoreParameterObjectSchema = {
	sources?: SourceSchema | SourceSchema[]
};

/**
 * The configuration of a store value
 */
export type StoreParameterSchema = StoreParameterObjectSchema | string

/**
 * All types that can be serialized in the store
 */
export type StoreValueType = string | number;

export type StoreValuesForOneConfig = {[storeValueLabel: string]: StoreValueType};

/**
 * The type of the object of store values.  A flat key/value dictionary used by the commands
 */
export type StoreValues = { [configKey: string]: StoreValuesForOneConfig };

export interface ConfigWithStoreParameters<T extends {[key: string]: StoreValueType}> {
	storeParameters: Record<keyof T, StoreParameterSchema>
	configKey: string;
}

export type BitbucketPrConfig = ConfigWithStoreParameters<{ workspace: string, repo: string }>;

export type PostgresqlConnectionParameters = {
	host: string;
	username: string;
	password: string;
	database: string;
	port: number
}

/**
 * @Doc
 * Attempt to connect to a postgres database and display whether it succeeded or failed
 */
export type PostgresqlConnectionConfig = {
	connectionLabel: string | ((storeParameters: PostgresqlConnectionParameters) => string)
// @ts-ignore
} & ConfigWithStoreParameters<{
	storeParameters: {
		postgresqlHost: StoreParameterSchema,
		postgresqlUsername: StoreParameterSchema,
		postgresqlPassword: StoreParameterSchema,
		postgresqlDatabase: StoreParameterSchema,
		postgresqlPort: StoreParameterSchema
	}
}>;
/**
 * Execute a GET http request to a target url, to make sure
 */
export type HealthCheckConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

/**
 * @Doc
 * Display the output of some shell command every 10 seconds
 */
export type RepeatCommandConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

/**
 * @Doc
 * Execute some javascript function at startup and display the output
 */
export type JavascriptFunctionConfig<T extends StoreValuesForOneConfig = {}> = {
	func: ((storeParameters: T) => Promise<string> | string)
} & ConfigWithStoreParameters<T>

/**
 * @Doc
 * Form a persistent ssh tunnel to the target machine while dashboar is running
 * ```
 * {
 *   TODO
 * }
 * ```
 */
export type SshTunnelConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

/**
 * @Doc
 * Display a list of environment variables and their values
 */
export type WatchedEnvironmentVariablesConfig = string[]

/**
 * @Doc
 * ```
 *   Use this to clone a repository if it doesn't exist, and then show its branch
 *   {
 *     url: "https://github.com/marvinirwin/dashboar"
 *   }
 *
 * ```
 */
export type RepositoryConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>


export type GitSyncRemotesConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>
