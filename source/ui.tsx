import React from 'react';
import CommandOutput from "./boards/command";
import {PullRequest} from "./boards/pull-request-list";
import {PullRequests} from "./PullRequest";

export type Config = { commands: string[], pullRequestConfigs: { workspace: string, repo: string }[] };

const DashBoards = ({config, pullRequestFetchFunction}: {
		config: Config,
		pullRequestFetchFunction: ({repo, workspace}: { repo: string, workspace: string }) => () => Promise<PullRequest[]>
	}) =>
		<>
			{
				config.commands.map(command => <CommandOutput key={command} command={command}/>)
			}
			{
				config.pullRequestConfigs.map(config => <PullRequests key={`${config.repo} ${config.workspace}`} fetchFunction={pullRequestFetchFunction(config)}/>)
			}
		</>
;


module.exports = DashBoards;
export default DashBoards;
