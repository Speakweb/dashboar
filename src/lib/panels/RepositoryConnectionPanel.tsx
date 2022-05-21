import {RepositoryConfig} from "../config";
import React, {useEffect, useState} from "react";
import {DashboarPanel} from "./DashboarPanel";
import {Text} from "ink";
import * as fs from "fs/promises";
import * as constants from "constants";
import simplegit from "simple-git";


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

const RepositoryConnection = ({url}: { url: string }) => {
	const [latestMessage, setLatestMessage] = useState<JSX.Element>(<Text>Loading...</Text>);
	const [latestError, setLatestError] = useState<any>();

	useEffect(() => {
		const fetchRepo = async () => {
			const name = getRepoName(url);

			const updateMessage = (text: string) => {
				setLatestMessage(
					<Text>{name}: {text}</Text>
				);
			}

			const exists = await fileExists(name);
			if (exists) {
				updateMessage("Exists");
			} else {
				updateMessage("Cloning");
				await simplegit().clone(url, process.cwd() + "/" + name);
				updateMessage("Cloned");
			}

			const branch = await simplegit(process.cwd() + "/" + name).branch();
			updateMessage(branch.current);

			const timer = setInterval(async () => {
				const branch = await simplegit(process.cwd() + "/" + name).branch();
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

const fileExists = async (name: string): Promise<boolean> => {
	try {
		await fs.access(name, constants.F_OK | constants.R_OK | constants.W_OK);
		return true;
	} catch (error) {
		return false;
	}
}
