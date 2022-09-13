import {getRepoName} from "./git";

const { Octokit } = require("octokit");
export const createGithubRepo = async function ({githubToken, name}:{name: string, githubToken: string}) {
    const res = await new Octokit({auth: githubToken}).request("POST /user/repos", {
        name: name,
        private: true
    });
    if (res.status !== 201) {
        console.log(res);
        throw new Error(`Failed to create repository: ${res.status}`);
    }
    console.log(`Created repository at ${res.data.html_url}`);
    return res.data.html_url;
}

export const inviteCollaborator = async function (
	{
		collaborator,
		repoURL,
		githubUsername,
		githubToken
	}:{
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
