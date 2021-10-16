/**
 * Accepts a repository object and returns a list of their names
 * @param response
 */
const getRepositoryNames = (response: BitBucketResponse.RootObject): string[] => {

	let repositoryNames: string[] = []
	response.data.values.forEach( repositoryObject => {
		repositoryNames.push(repositoryObject.name)
	})

return repositoryNames
}

export default getRepositoryNames;
