import {RepositoryConfig} from "../lib/config/config";
import React, {useEffect, useState} from "react";
import {DashboarPanel} from "./DashboarPanel";
import {Text} from "ink";
import * as fs from "fs/promises";
import * as constants from "constants";
import simplegit from "simple-git";
import {join, sep} from 'path'


export class RepositoryConnectionPanel extends DashboarPanel<RepositoryConfig> {
	errorMessage(): string | undefined {
		// TODO check if urls property exists before starting
		return undefined;
	}

	pane() {
		const configValues = this.configEntry as unknown as { url: string; };
		return <RepositoryConnection
			key={this.configEntry.configKey}
			{...configValues}
		/>;
	}
}

async function getBranch(cloneDestinationDirectory: string) {
	return await simplegit(cloneDestinationDirectory).branch();
}

const RepositoryConnection = ({url}: { url: string }) => {
	const [latestMessage, setLatestMessage] = useState<JSX.Element>(<Text>Loading...</Text>);
	const [latestError, setLatestError] = useState<any>();

	useEffect(() => {
		const fetchRepo = async () => {
			const repoName = getRepoName(url);

			const updateMessage = (text: string) => {
				setLatestMessage(
					<Text>{repoName}: {text}</Text>
				);
			}

			const cloneDestinationDirectory = join(process.cwd(), repoName);
			const isDirectlyAboveRepository = await pathExists(repoName);
			const isSomewhereUnderRepository = process.cwd().split(sep).includes(repoName);
			let repoPath: string = "";

			if (isDirectlyAboveRepository) {
				repoPath = cloneDestinationDirectory;
			}else
			if (isSomewhereUnderRepository) {
				repoPath = process.cwd().split(sep).slice(0, process.cwd().indexOf(repoName)).join(sep);
			} else {
				updateMessage(`Cloning ${cloneDestinationDirectory}`);
				await simplegit().clone(url, cloneDestinationDirectory);
				updateMessage(`Cloned ${cloneDestinationDirectory}`);
				repoPath = cloneDestinationDirectory;
			}

			const branch = await getBranch(repoPath);
			updateMessage(branch.current);

			const timer = setInterval(async () => {
				const branch = await getBranch(repoPath);
				updateMessage(branch.current);
			}, 5000);

			return () => clearInterval(timer);
		}

		fetchRepo().catch(setLatestError);
	}, [url])

	if (latestError) {
		return <Text>{JSON.stringify(latestError)}</Text>
	}
	return <Text>{latestMessage}</Text>
}

const getRepoName = (url: string): string => {
	const match = /(.*\/)(?<reponame>.*?)(?:\.git)?$/.exec(url)?.groups?.["reponame"];
	if (!match) {
		throw new Error("Repository name cannot be empty.");
	}
	return match;
}

const pathExists = async (name: string): Promise<boolean> => {
	try {
		await fs.access(name, constants.F_OK | constants.R_OK | constants.W_OK);
		return true;
	} catch (error) {
		return false;
	}
}
