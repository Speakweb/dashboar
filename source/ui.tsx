import React from 'react';
import CommandOutput from './components/command';
import {PullRequest} from './components/pull-request-list';
import {PullRequests} from "./components/pull-requests";
import {Box} from 'ink';
import {Config} from "./lib/config";

const Ui = ({config, pullRequestFetchFunction}: {
		config: Config,
		pullRequestFetchFunction: ({repo, workspace}: { repo: string, workspace: string }) => () => Promise<PullRequest[]>
	}) =>
		<>
			<Box borderStyle="single" flexDirection='column'>
				{
					config.commands.map(command =>
						<CommandOutput key={command} command={command}/>
					)
				}
			</Box>
			{
				config.pullRequestConfigs.map(config => <Box
					key={`${config.repo} ${config.workspace}`}
					borderStyle="single" flexDirection='column'>
					<PullRequests
						fetchFunction={pullRequestFetchFunction(config)}
						repositoryName={config.repo}
					/>
				</Box>)
			}
		</>
;


module.exports = Ui;
export default Ui;
