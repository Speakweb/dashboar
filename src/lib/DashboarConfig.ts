import {
    BitbucketPrConfig,
    PostgresqlConnectionConfig,
	HealthCheckConfig,
    RepeatCommandConfig,
    SshTunnelConfig,
    WatchedEnvironmentVariablesConfig
} from "./config";

export type DashboarConfig = {
    repeatCommands?: RepeatCommandConfig[],
    pullRequestConfigs?: BitbucketPrConfig[],
    sshTunnels?: SshTunnelConfig[],
	healthCheck?: HealthCheckConfig[],
	postgresqlConnections?: PostgresqlConnectionConfig[],
    watchedEnvironmentVariables?: WatchedEnvironmentVariablesConfig[]
};
