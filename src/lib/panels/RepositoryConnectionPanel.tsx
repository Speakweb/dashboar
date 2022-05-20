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
		const configValues = this.configEntry as unknown as { urls: string[]; };
		return <RepositoryConnection
			key={this.configEntry.configKey}
			{...configValues}
		/>;
	}
}


const RepositoryConnection = ({urls}: { urls: string[] }) => {
	const [latestMessage, setLatestMessage] = useState<any>();
	const [latestError, setLatestError] = useState<any>();

	useEffect(() => {
		const fetchRepos = async () => {
			let texts = new Map<Repository, string>();

			const updateMessage = (repository: Repository, text: string) => {
				texts.set(repository, text);
				let mappedTexts = [];
				for (const [repo, text] of texts.entries()) {
					mappedTexts.push(`${repo.name}: ${text}`);
				}

				setLatestMessage(
					<Text>
						{mappedTexts.join("\n")}
					</Text>
				);
			}

			for (const url of urls) {
				const name = getRepoName(url);
				texts.set(new Repository(url, name), "Loading...");
			}

			for (const repo of texts.keys()) {
				const { name, url } = repo;
				const exists = await fileExists(name);
				if (exists) {
					updateMessage(repo, "Exists");
				} else {
					updateMessage(repo, "Cloning");
					await simplegit().clone(url, process.cwd() + "/" + name);
					updateMessage(repo, "Cloned");
				}
				const branch = await simplegit(process.cwd() + "/" + name).branch();
				updateMessage(repo, branch.current);
			}

			const timer = setInterval(async () => {
				for (const repo of texts.keys()) {
					const branch = await simplegit(process.cwd() + "/" + repo.name).branch();
					updateMessage(repo, branch.current);
				}
			}, 5000);

			return () => clearInterval(timer);
		}

		setLatestMessage("Loading...");
		fetchRepos().catch(setLatestError);
	}, [urls])

	if (latestError) {
		return <Text>{JSON.stringify(latestError) + "hi"}</Text>
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

class Repository {
	public url: string;
	public name: string;

	constructor(url: string, name: string) {
		this.url = url;
		this.name = name;
	}
}
