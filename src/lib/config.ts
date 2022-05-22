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

export type HealthCheckConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

export type RepeatCommandConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

export type SshTunnelConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

export type WatchedEnvironmentVariablesConfig = string[]

export type RepositoryConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

