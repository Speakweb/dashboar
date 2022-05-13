import {
    BitbucketPrConfig,
    PostgresqlConnectionConfig,
    RepeatCommandConfig,
    SshTunnelConfig,
    WatchedEnvironmentVariablesConfig
} from "./config";

export type DashboarConfig = {
    repeatCommands?: RepeatCommandConfig[],
    pullRequestConfigs?: BitbucketPrConfig[],
    sshTunnels?: SshTunnelConfig[],
    postgresqlConnections?: PostgresqlConnectionConfig[],
    watchedEnvironmentVariables?: WatchedEnvironmentVariablesConfig[]
};
