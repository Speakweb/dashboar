import {
	BitbucketPrConfig,
	PostgresqlConnectionConfig,
	HealthCheckConfig,
	RepeatCommandConfig,
	SshTunnelConfig,
	WatchedEnvironmentVariablesConfig,
	RepositoryConfig, JavascriptFunctionConfig
} from "./config";

export type DashboarConfig = {
	repeatCommands?: RepeatCommandConfig[],
	pullRequestConfigs?: BitbucketPrConfig[],
	sshTunnels?: SshTunnelConfig[],
	healthChecks?: HealthCheckConfig[],
	postgresqlConnections?: PostgresqlConnectionConfig[],
	watchedEnvironmentVariables?: WatchedEnvironmentVariablesConfig[],
	repositoryConfigs?: RepositoryConfig[]
	javascriptFunctions?: JavascriptFunctionConfig[]
};
