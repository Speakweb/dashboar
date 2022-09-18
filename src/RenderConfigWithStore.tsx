import React from 'react';
import RepeatCommand from './components/ShellCommands/RepeatCommand';
import {Box} from 'ink';
import {StoreValues} from "./lib/config/config";
import {PostgresConnectionParameters, PostgresqlConnectionPanel} from "./panels/PostgresqlConnectionPanel";
import {RepositoryConnectionPanel} from "./panels/RepositoryConnectionPanel";
import {SshTunnelPanel} from "./panels/SshTunnelPanel";
import {EnvironmentVariablesPanel} from "./panels/EnvironmentVariablesPanel";
import {DashboarConfig} from "./lib/config/DashboarConfig";
import {HealthCheckPanel} from "./panels/HealthCheckPanel";
import {OneTimeJavascriptFunction} from './components/OneTimeJavascriptFunction';
import {GitSyncRemotesPanel, GitSyncRemotesStoreParams} from "./panels/GitSyncRemotesPanel";
import {BitBucketPullRequest} from "./components/BitBucket/BitBucketPullRequestList";
import { BitBucketPullRequests } from './components/BitBucket/BitBucketPullRequests';

const RenderConfigWithStore = (
		{
			config: {
				repeatCommands,
				bitBucketPullRequestConfigs,
				sshTunnels,
				httpHealthChecks,
				postgresqlConnections,
				watchedEnvironmentVariables,
				clonedRepositoryConfigs,
				oneTimeJavascriptFunctions,
				syncedGitRemotes
			},
			pullRequestFetchFunction,
			storeValues
		}: {
			config: DashboarConfig,
			pullRequestFetchFunction: ({
										   repo,
										   workspace
									   }: { repo: string, workspace: string }
			) => () => Promise<BitBucketPullRequest[]>,
			storeValues: StoreValues,

		}
	) => {
		return <>
			{
				watchedEnvironmentVariables?.map((variableList: string[], index: number) => new EnvironmentVariablesPanel(variableList).Component({key: index}))
			}
			{
				repeatCommands?.map(({command}) => {
						const str = typeof command === 'string' ? command : command(storeValues);
						return <RepeatCommand key={str} command={str}/>;
					}
				)
			}
			{
				bitBucketPullRequestConfigs?.map(({storeParameters}) => <Box
					key={`${storeParameters.workspace} ${storeParameters.repo}`}
					borderStyle="single" flexDirection='column'>
					<BitBucketPullRequests
						fetchFunction={pullRequestFetchFunction(storeParameters as unknown as { repo: string, workspace: string })}
						key={`${storeParameters.repo} ${storeParameters.workspace}`}
					/>
				</Box>)
			}
			{
				sshTunnels?.map((config, i) => {
						return new SshTunnelPanel({
							configEntry: config,
							storeEntry: storeValues[config.configKey] || {}
						}).Component({key: config.configKey || i});
					}
				)
			}
			{
				httpHealthChecks?.map((config, i) =>
					new HealthCheckPanel({
						configEntry: config,
						storeEntry: storeValues[config.configKey] || {}
					}).Component({key: config.configKey || i})
				)
			}
			{
				postgresqlConnections?.map((config, i) =>
					new PostgresqlConnectionPanel({
						configEntry: config,
						// TODO do real parameter validation
						storeEntry: (storeValues[config.configKey] || {}) as PostgresConnectionParameters
					}).Component({key: config.configKey || i})
				)
			}
			{
				clonedRepositoryConfigs?.map((config, i) =>
					new RepositoryConnectionPanel({
						configEntry: config,
						storeEntry: storeValues[config.configKey] || {}
					}).Component({key: config.configKey || i})
				)
			}
			{
				oneTimeJavascriptFunctions?.map((config, i) => <OneTimeJavascriptFunction
						key={i}
						configKey={config.configKey}
						func={() => config.func(storeValues[config.configKey] || {})}
					/>
				)
			}
			{
				syncedGitRemotes?.map((config, i) => {
					return new GitSyncRemotesPanel(
						{
							configEntry: config,
							storeEntry: (storeValues[config.configKey] || {}) as GitSyncRemotesStoreParams
						}
					).Component({key: i});
				})
			}
		</>;
	}
;


module.exports = RenderConfigWithStore;
export default RenderConfigWithStore;
