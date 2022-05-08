import {PullRequest} from "../components/PullRequestList";

const {Bitbucket} = require("bitbucket");
const clientOptions = {
	auth: {
		username: process.env["BITBUCKET_EMAIL"],
		password: process.env["BITBUCKET_PASSWORD"],
	},
}

const getBitbucket = () => new Bitbucket(clientOptions);

export const fetchPullRequests = ({repo, workspace}: {repo: string, workspace: string}): Promise<PullRequest[]> => {
	return getBitbucket().pullrequests.list({repo_slug: repo, workspace})
		.then((result: any)  => result.data.values)
}

export const fetchRepositories = ({workspace}:{workspace: string}) => {
	// TODO, make this work with pages.  For some reason the page param is a string?  Yet pageLen is a number?
	return getBitbucket().repositories.list({pagelen: 100, workspace});
}
