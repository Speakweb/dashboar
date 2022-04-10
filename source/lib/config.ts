/**
 * The configuration of a store value
 */
export type StoreParameterSchema = {
	type?: "string" | "number";
	prompt: "string" | (() => string)
} | string


/**
 * All types that can be serialized in the store
 */
export type StoreValueTypes = string | number;

export type StoreValuesForOneConfig = {[storeValueLabel: string]: StoreValueTypes};


/**
 * The type of the object of store values.  A flat key/value dictionary used by the commands
 */
export type StoreValues = { [configKey: string]: StoreValuesForOneConfig };

export interface ConfigWithStoreParameters<T extends {[key: string]: StoreValueTypes}> {
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

export type RepeatCommandConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>

export type SshTunnelConfig<T extends StoreValuesForOneConfig = {}> = {
	command: string | ((storeParameters: T) => string)
} & ConfigWithStoreParameters<T>


export type DashboarConfig = {
	repeatCommands?: RepeatCommandConfig[],
	pullRequestConfigs?: BitbucketPrConfig[]
	sshTunnels?: SshTunnelConfig[]
	postgresqlConnections?: PostgresqlConnectionConfig[]
};
