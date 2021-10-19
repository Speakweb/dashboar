import React from 'react';
import CommandOutput from "./boards/command";
import {PullRequest} from "./boards/pull-request-list";
import {PullRequests} from "./PullRequest";
import {render, Box, Text} from 'ink';

export type Config = { commands: string[], pullRequestConfigs: { workspace: string, repo: string }[] };

const DashBoards = ({config, pullRequestFetchFunction}: {
		config: Config,
		pullRequestFetchFunction: ({repo, workspace}: { repo: string, workspace: string }) => () => Promise<PullRequest[]>
	}) =>
		<>
			{
				config.commands.map(command => <Box margin={2}> <CommandOutput key={command} command={command}/> </Box>)
			}

			{
				config.pullRequestConfigs.map(config => <Box margin={2}> <PullRequests  key={`${config.repo} ${config.workspace}`} fetchFunction={pullRequestFetchFunction(config)}/> </Box>)
			}
		</>
;


module.exports = DashBoards;
export default DashBoards;
/////
const Example = () => (
	<Box margin={2}>
		<Text>This is a box with margin</Text>
	</Box>
);

render(<Example />);
