import simplegit from "simple-git";
import * as fs from "fs/promises";
import * as constants from "constants";
import {exec} from 'child_process';


export const execPromise = (command: string) => new Promise((resolve, reject) => {
	console.log(command);
	exec(command, (error, stdout, stderr) => {
		if (error) {
			reject(error.message)
			return;
		}
		if (stderr) {
			console.warn(stderr)
		}
		resolve(stdout)
	})
})



// @ts-ignore
export const copyRepo = async function (repoPath: string, originUrl: string, sourceUrl: string, branches: string[]) {
// @ts-ignore
	try {
		await execPromise(`git -C "${repoPath}" remote set-url origin ${originUrl}`);
	} catch (e) {
		console.warn(e)
	}
	try {
		await execPromise(`git -C "${repoPath}" remote add source ${sourceUrl}`);
	} catch (e) {
		console.warn(e)
	}
	for (const branch of branches) {
		await execPromise(`git -C ${repoPath} fetch source ${branch}`)
		await execPromise(`git -C ${repoPath} checkout -b ${branch}`);
		await execPromise(`git -C ${repoPath} checkout ${branch}`);
		await execPromise(`git -C ${repoPath} reset source/${branch}`);
		let message = await execPromise(`git -C "${repoPath}" push origin ${branch}`);
		console.log(message)
	}
};

export const cloneRepo = async function (url: string, destPath: string) {
	const name = getRepoName(url);
	const exists = await fileExists(name);
	if (exists) {
		await fs.rm(name, {recursive: true});
	}
	await simplegit().clone(url, destPath);
}

export const getRepoName = (url: string): string => {
	const match = /(.*\/)(?<reponame>.*?)(?:\.git)?$/.exec(url)?.groups?.["reponame"];
	if (!match) {
		throw new Error("Repository name cannot be empty.");
	}
	return match;
}

export const fileExists = async (name: string): Promise<boolean> => {
	try {
		await fs.access(name, constants.F_OK | constants.R_OK | constants.W_OK);
		return true;
	} catch (error) {
		return false;
	}
}
