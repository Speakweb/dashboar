/**
 * Accepts a repository object and returns a list of their names
 * @param response
 */
const getRepositoryNames = (response: BitBucketResponse.RootObject): string[] => {
	response.data.values.forEach(bitbucketRepository => {
		// bitbucketRepository.scm
		// bitbucketRepository.name
		return bitbucketRepository.scm;
	});
	return [];
}

export default getRepositoryNames;
