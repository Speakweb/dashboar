import React from 'react';
import CommandOutput from "./boards/command";
import {PullRequest} from "./boards/pull-request-list";
import {PullRequests} from "./PullRequest";
import {Box} from 'ink';

export type Config = { commands: string[], pullRequestConfigs: { workspace: string, repo: string }[] };

const DashBoards = ({config, pullRequestFetchFunction}: {
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
						fetchFunction={pullRequestFetchFunction(config)}/>
				</Box>)
			}
		</>
;


module.exports = DashBoards;
export default DashBoards;
