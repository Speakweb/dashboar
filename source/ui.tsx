import React from 'react';
import RepeatCommand from './components/RepeatCommand';
import {PullRequest} from './components/PullRequestList';
import {PullRequests} from "./components/PullRequests";
import {Box} from 'ink';
import {DashboarConfig, StoreValues} from "./lib/config";
import {PostgresqlConnectionPanel} from "./lib/panels/PostgresqlConnectionPanel";
import {SshTunnelPanel} from "./lib/panels/SshTunnelPanel";

const Ui = (
	{
		config: {
			repeatCommands,
			pullRequestConfigs,
			sshTunnels,
			postgresqlConnections
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
		<Box borderStyle="single" flexDirection='column'>
			{
				repeatCommands?.map(({command}) => {
						const str = typeof command === 'string' ? command : command(storeValues);
						return <RepeatCommand key={str} command={str}/>;
					}
				)
			}
		</Box>
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
			sshTunnels?.map((config) => new SshTunnelPanel({
					configEntry: config,
					storeEntry: storeValues[config.configKey] || {}
				}).Component({key: config.configKey})
			)
		}
		{
			postgresqlConnections?.map(config =>
				new PostgresqlConnectionPanel({
					configEntry: config,
					storeEntry: storeValues[config.configKey] || {}
				}).Component({key: config.configKey})
			)
		}
	</>
;


module.exports = Ui;
export default Ui;
