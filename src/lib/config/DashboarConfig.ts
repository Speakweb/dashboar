import {
	BitbucketPrConfig,
	PostgresqlConnectionConfig,
	HealthCheckConfig,
	RepeatCommandConfig,
	SshTunnelConfig,
	WatchedEnvironmentVariablesConfig,
	RepositoryConfig, JavascriptFunctionConfig, GitSyncRemotesConfig
} from "./config";

export interface DashboarConfigElement {
	type: keyof DashboarConfig,
}

export type DashboarConfig = {
	repeatCommands?: RepeatCommandConfig[],
	bitBucketPullRequestConfigs?: BitbucketPrConfig[],
	sshTunnels?: SshTunnelConfig[],
	httpHealthChecks?: HealthCheckConfig[],
	postgresqlConnections?: PostgresqlConnectionConfig[],
	watchedEnvironmentVariables?: WatchedEnvironmentVariablesConfig[],
	clonedRepositoryConfigs?: RepositoryConfig[]
	oneTimeJavascriptFunctions?: JavascriptFunctionConfig[]
	syncedGitRemotes?: GitSyncRemotesConfig[]
};


