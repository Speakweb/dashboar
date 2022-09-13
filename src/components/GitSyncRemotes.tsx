import {Box, Text} from "ink";
import React, {useEffect, useState} from "react";
import simplegit from "simple-git";
import {useInterval} from "../../epub-finder/reader/src/components/pronunciation-video/useInterval";
import {GitSyncRemotesStoreParams, MirrorRepoParameters} from "../panels/GitSyncRemotesPanel";
import {adjectives, animals, colors, uniqueNamesGenerator} from 'unique-names-generator';
import {cloneRepo, copyRepo, getRepoName} from "../lib/git";
import {prefixUrlWithTokenAuth} from "../lib/prefixUrlWithTokenAuth";
import {createGithubRepo, inviteCollaborator} from "../lib/github";

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
		baseDir, sourceRemote, destRemote, branch,
		...mirrorParameters
	}: GitSyncRemotesStoreParams) => {
	const {addLog, logs} = useLoggedState(5);
	useEffect(() => {
		(async () => {
			if ((mirrorParameters as MirrorRepoParameters).sourceRepoURL) {
				const {sourceRepoURL, sourceUserName, sourceRepoToken, githubToken, githubUsername, githubCollaborators} = mirrorParameters as MirrorRepoParameters;
				const name = getRandomName(getRepoName(sourceRepoURL));
				// TODO check if the repo already exists
				const sourceUrlWithAuthToken = prefixUrlWithTokenAuth({url: sourceRepoURL, username: sourceUserName, token: sourceRepoToken});
				await cloneRepo(sourceUrlWithAuthToken);
				const githubURL = await createGithubRepo({githubToken, name});
				const newGithubRepoWithAuthToken = prefixUrlWithTokenAuth({url: githubURL, token: githubToken, username: githubUsername });
				await copyRepo(process.cwd() + "/" + name, newGithubRepoWithAuthToken, sourceUrlWithAuthToken);
				for (const collaborator of githubCollaborators) {
					await inviteCollaborator({
						collaborator,
						repoURL: sourceRepoURL,
						githubUsername,
						githubToken
					});
				}
			}
		})()
	}, [])
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
