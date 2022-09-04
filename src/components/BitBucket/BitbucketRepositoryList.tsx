import BitBucketRepository = BitBucketResponse.BitBucketRepository;
import React from "react";
import {Text} from 'ink'

// @ts-ignore
const BitbucketRepositoryList: React.FC<{ repositories: BitBucketRepository[] }> = ({repositories}) => {
	const listOfRepositoryElements: React.ReactElement[] = [];
	repositories.forEach(repository => {
		listOfRepositoryElements.push(<Text key={repository.name}>{repository.name}</Text>)
	})
	return listOfRepositoryElements;
};
export default BitbucketRepositoryList;
