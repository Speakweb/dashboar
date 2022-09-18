import {Box, Text} from "ink";
import React, {useEffect,  useState} from "react";
import simplegit from "simple-git";
import {GitSyncRemotesStoreParams, MirrorRepoParameters} from "../panels/GitSyncRemotesPanel";
import {adjectives, animals, colors, uniqueNamesGenerator} from 'unique-names-generator';
import {cloneRepo, copyRepo, getRepoName} from "../lib/git";
import {prefixUrlWithTokenAuth} from "../lib/prefixUrlWithTokenAuth";
import {createGithubRepo, inviteCollaborator} from "../lib/github";
import {existsSync} from "fs";
import {join} from "path";

/*
function useInterval(callback: () => void, delay: number | null) {
	const savedCallback = useRef(callback)

	// Remember the latest callback if it changes.
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])

	// Set up the interval.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (!delay && delay !== 0) {
			return
		}

		const id = setInterval(() => savedCallback.current(), delay)

		return () => clearInterval(id)
	}, [delay])
}
*/

const useLoggedState = (logLimit: number) => {
	const [logLines, setLogLines] = useState<string[]>([]);
	return {
		addLog: (s: string) => setLogLines(currentLogLines => currentLogLines.concat(s).slice(0, logLimit)),
		logs: logLines
	}
}

const getRandomName = (seed: string) => {
	return uniqueNamesGenerator({
		dictionaries: [adjectives, colors, animals],
		separator: '_',
		seed
	})
}


export const GitSyncRemotes = (
	{
		baseDir: paramBaseDir, sourceRemote, destRemote, branch,
		...mirrorParameters
	}: GitSyncRemotesStoreParams) => {
	const {addLog, logs} = useLoggedState(5);
	let baseDir = paramBaseDir;
	useEffect(() => {
		(async () => {
			if ((mirrorParameters as MirrorRepoParameters).sourceRepoURL) {
				const {sourceRepoURL, sourceUserName, sourceRepoToken, githubToken, githubUsername, githubCollaborators} = mirrorParameters as MirrorRepoParameters;
				const name = getRandomName(getRepoName(sourceRepoURL));
				baseDir = name;
				// TODO check if the repo already exists
				const sourceUrlWithAuthToken = prefixUrlWithTokenAuth({url: sourceRepoURL, username: sourceUserName, token: sourceRepoToken});
				const clonedRepoDirectory = join(process.cwd(), name);
				if (!existsSync(clonedRepoDirectory)) {
					await cloneRepo(sourceUrlWithAuthToken, clonedRepoDirectory);
				}
				const githubURL = await createGithubRepo({githubToken, name, githubUsername});
				const newGithubRepoWithAuthToken = prefixUrlWithTokenAuth({url: githubURL, token: githubToken, username: githubUsername, });
				await copyRepo(clonedRepoDirectory, newGithubRepoWithAuthToken, sourceUrlWithAuthToken, [branch]);
				for (const collaborator of githubCollaborators) {
					await inviteCollaborator({
						collaborator,
						repoURL: githubURL,
						githubUsername,
						githubToken
					});
				}
				setInterval(() => {
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
			}
		})().catch(console.warn)
	}, []);
	return <Box>
		{logs.map((log, i) => <Text key={`${log}_${i}`}>{log}</Text>)}
	</Box>
}
