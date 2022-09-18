import {getRepoName} from "./git";

const {Octokit} = require("octokit");
export const createGithubRepo = async function ({githubToken, name, githubUsername}: { name: string, githubToken: string, githubUsername: string }) {
	try {
		const allRepos = await new Octokit({auth: githubToken}).rest.repos.get({owner: githubUsername, repo: name, type: 'private'});
		console.log(allRepos)
		const existingRepo = allRepos.data;
		if (existingRepo) {
			return existingRepo.html_url
		}
	} catch(e) {
		console.warn(e)
	}
	const createResult = await new Octokit({auth: githubToken}).request("POST /user/repos", {
		name: name,
		private: true
	});
	if (createResult.status !== 201) {
		console.log(createResult);
		throw new Error(`Failed to create repository: ${createResult.status}`);
	}
	console.log(`Created repository at ${createResult.data.html_url}`);
	return createResult.data.html_url;
}

export const inviteCollaborator = async function (
	{
		collaborator,
		repoURL,
		githubUsername,
		githubToken
	}: {
		collaborator: string,
		repoURL: string,
		githubUsername: string,
		githubToken: string,
	}
) {
	const res = await new Octokit({auth: githubToken}).request(`PUT /repos/${githubUsername}/${getRepoName(repoURL)}/collaborators/${collaborator}`, {
		owner: githubUsername,
		repo: getRepoName(repoURL),
		username: collaborator
	});
	if (res.status !== 201) {
		console.log(res);
		throw new Error(`Failed to invite collaborators: ${res.status}`);
	}
	const url = res.data.html_url;
	console.log(`Invited ${collaborator} to ${getRepoName(repoURL)}. URL: ${url}`);
}
