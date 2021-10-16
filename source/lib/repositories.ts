/**
 * Accepts a repository object
 * @param response
 */
const getRepositoryNames = (response: BitBucketResponse.RootObject): string[] => {
	response.data.values.forEach(bitbucketRepository => {
		// bitbucketRepository.scm
		// bitbucketRepository.name
	})
	return [];
}
