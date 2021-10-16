import BitBucketRepository = BitBucketResponse.BitBucketRepository;
import React from "react";
import { Text } from 'ink'

// @ts-ignore
const RepositoryList: React.FC<{repositories: BitBucketRepository[]}> = ({repositories}) => {
	const listOfRepositoryElements: React.ReactElement[] = [];
	listOfRepositoryElements.push(<Text>yeet</Text>)
	return [];
};
export default RepositoryList;
