import React from 'react';
import RepeatCommand from './components/RepeatCommand';
import {PullRequest} from './components/PullRequestList';
import {PullRequests} from "./components/PullRequests";
import {Box} from 'ink';
import {StoreValues} from "./lib/config";
import {PostgresqlConnectionPanel} from "./lib/panels/PostgresqlConnectionPanel";
import {RepositoryConnectionPanel} from "./lib/panels/RepositoryConnectionPanel";
import {SshTunnelPanel} from "./lib/panels/SshTunnelPanel";
import {EnvironmentVariablesPanel} from "./lib/panels/EnvironmentVariablesPanel";
import {DashboarConfig} from "./lib/DashboarConfig";
import {HealthCheckPanel} from "./lib/panels/HealthCheckPanel";

const Ui = (
	{
		config: {
			repeatCommands,
			pullRequestConfigs,
			sshTunnels,
			healthChecks,
			postgresqlConnections,
			watchedEnvironmentVariables,
			repositoryConfigs
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
		storeValues: StoreValues
	}
	) =>
	<>
		{
			watchedEnvironmentVariables?.map((variableList: string[], index: number) => new EnvironmentVariablesPanel(variableList).Component({key: index}) )
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
					fetchFunction={pullRequestFetchFunction(storeParameters as unknown as {repo: string, workspace: string})}
					key={`${storeParameters.repo} ${storeParameters.workspace}`}
				/>
			</Box>)
		}
		{
			sshTunnels?.map((config, i) => new SshTunnelPanel({
					configEntry: config,
					storeEntry: storeValues[config.configKey] || {}
				}).Component({key: config.configKey || i})
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
	</>
;


module.exports = Ui;
export default Ui;
