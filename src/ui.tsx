import React from 'react';
import RepeatCommand from './components/RepeatCommand';
import {PullRequest} from './components/PullRequestList';
import {PullRequests} from "./components/PullRequests";
import {Box} from 'ink';
import {StoreValues} from "./lib/config";
import {PostgresqlConnectionPanel} from "./panels/PostgresqlConnectionPanel";
import {RepositoryConnectionPanel} from "./panels/RepositoryConnectionPanel";
import {SshTunnelPanel} from "./panels/SshTunnelPanel";
import {EnvironmentVariablesPanel} from "./panels/EnvironmentVariablesPanel";
import {DashboarConfig} from "./lib/DashboarConfig";
import {HealthCheckPanel} from "./panels/HealthCheckPanel";
import {JavascriptFunction} from './components/JavascriptFunction';

const Ui = (
		{
			config: {
				repeatCommands,
				pullRequestConfigs,
				sshTunnels,
				healthChecks,
				postgresqlConnections,
				watchedEnvironmentVariables,
				repositoryConfigs,
				javascriptFunctions
			},
			pullRequestFetchFunction,
			storeValues
		}: {
			config: DashboarConfig,
			pullRequestFetchFunction: ({
										   repo,
										   workspace
									   }: { repo: string, workspace: string }
			) => () => Promise<PullRequest[]>,
			storeValues: StoreValues,

		}
	) =>
		<>
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
				pullRequestConfigs?.map(({storeParameters}) => <Box
					key={`${storeParameters.workspace} ${storeParameters.repo}`}
					borderStyle="single" flexDirection='column'>
					<PullRequests
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
				healthChecks?.map((config, i) =>
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
						storeEntry: storeValues[config.configKey] || {}
					}).Component({key: config.configKey || i})
				)
			}
			{
				repositoryConfigs?.map((config, i) =>
					new RepositoryConnectionPanel({
						configEntry: config,
						storeEntry: storeValues[config.configKey] || {}
					}).Component({key: config.configKey || i})
				)
			}
			{
				javascriptFunctions?.map((config, i) => <JavascriptFunction
						key={i}
						configKey={config.configKey}
						func={() => config.func(storeValues[config.configKey] || {})}
					/>
				)
			}
		</>
;


module.exports = Ui;
export default Ui;
