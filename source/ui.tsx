import React from 'react';
import CommandOutput from "./boards/command";
import {PullRequest} from "./boards/pull-request-list";
import {PullRequests} from "./PullRequest";

export type Config = { commands: string[] };

const DashBoards = ({config, pullRequestFetchFunction}:{config: Config, pullRequestFetchFunction: () => Promise<PullRequest[]>}) => {
	return <>
		{
			config.commands.map(command => <CommandOutput key={command} command={command}/> )
		}
		<PullRequests fetchFunction={pullRequestFetchFunction}/>
	</>
};


module.exports = DashBoards;
export default DashBoards;
