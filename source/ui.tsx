import React from 'react';
import CommandOutput from './components/RepeatCommand';
import {PullRequest} from './components/PullRequestList';
import {PullRequests} from "./components/PullRequests";
import {Box} from 'ink';
import {DashboarConfig, StoreValues} from "./lib/config";
import {PostgresConnection} from "./components/PostgresConnection";

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
						return <CommandOutput key={str} command={str}/>;
					}
				)
			}
		</Box>
		{
			pullRequestConfigs?.map(({storeParameters}) => <Box
				key={`${storeParameters.workspace} ${storeParameters.repo}`}
				borderStyle="single" flexDirection='column'>
				<PullRequests
					fetchFunction={pullRequestFetchFunction(storeParameters as unknown as {repo: string, workspace: string})}/>
			</Box>)
		}
		{
			sshTunnels?.map(({command}) => {
					const str = typeof command === 'string' ? command : command(storeValues);
					return <CommandOutput key={str} command={str}/>;
				}
			)
		}
		{
			postgresqlConnections?.map(({configKey}) => {
				const configValues = storeValues[configKey];
					// @ts-ignore
				return <PostgresConnection
						key={configKey}
						{...configValues}
					/>;
				}
			)
		}
	</>
;


module.exports = Ui;
export default Ui;
