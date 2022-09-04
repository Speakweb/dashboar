import {Box, Text} from "ink";
import React, {useState} from "react";
import simplegit from "simple-git";
import {useInterval} from "../../epub-finder/reader/src/components/pronunciation-video/useInterval";
import {GitSyncRemotesStoreParams} from "../panels/GitSyncRemotesPanel";

const useLoggedState = (logLimit: number) => {
	const [logLines, setLogLines] = useState<string[]>([]);
	return {
		addLog: (s: string) => setLogLines(currentLogLines => currentLogLines.concat(s).slice(0, logLimit)),
		logs: logLines
	}
}
export const GitSyncRemotes = ({baseDir, sourceRemote, destRemote, branch}: GitSyncRemotesStoreParams) => {
	const { addLog, logs } = useLoggedState(5);
	useInterval(() => {
			(async () => {
				addLog(`Checking to see if ${baseDir} is a git repo`);
				// Will this throw an error if baseDir doesn't contain a git repo?
				const repo = simplegit({baseDir: baseDir})
				addLog(`Checking to see if ${sourceRemote} and ${destRemote} are both remotes`);
				const remotes = new Set((await repo.getRemotes()).map(({name}) => name));
				if (!remotes.has(sourceRemote)) {
					throw new Error(`Cannot find source remote ${sourceRemote}`)
				}
				if (!remotes.has(destRemote)) {
					throw new Error(`Cannot find dest remote ${sourceRemote}`)
				}
				addLog(`Pulling ${sourceRemote} ${branch}`)
				// Git pull remote <branch> TODO handle cases of failure/merge stuff
				await repo.pull(sourceRemote, branch);
				addLog(`Pushing ${destRemote} ${branch}`)
				await repo.push(destRemote, branch);
				// Now they're sync'd
				addLog(`${sourceRemote}/${branch} has been pushed to ${destRemote}/${branch}`)
			})()
	}, 10000)
	return <Box>
		{logs.map((log, i) => <Text key={`${log}_${i}`}>{log}</Text>)}
	</Box>
}
