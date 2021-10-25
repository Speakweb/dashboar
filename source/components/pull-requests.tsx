import {PullRequest, PullRequestList} from "./pull-request-list";
import {Text, Box} from "ink";
import React, {useEffect, useState} from "react";

const ONE_MINUTE = 60000;

export function PullRequests({fetchFunction, repositoryName}: {
    fetchFunction: () => Promise<PullRequest[]>
	repositoryName: string
}) {

    const [pullRequests, setPulLRequests] = useState<PullRequest[]>([]);
    const [fetchingError, setFetchingError] = useState<string>('');

    useEffect(() => {

		fetchFunction()
			.then(values => setPulLRequests(values))
			.then(() => setFetchingError(''))
			.catch(errorCaught => {
				setFetchingError(errorCaught.error)
			})

		setInterval(() => {
			fetchFunction()
				.then(values => setPulLRequests(values))
				.then(() => setFetchingError(''))
				.catch(errorCaught => {
					setFetchingError(errorCaught.error)
				})

        }, ONE_MINUTE)
    }, []);

	const returnWithTitle = ({repositoryName,display}:{
		repositoryName: string
		display: React.ReactElement
	}) => {
		return <Box> <Text>{repositoryName}</Text>{display}</Box>
	}

	if (fetchingError) {
		return returnWithTitle({repositoryName:<Text>{fetchingError}</Text>})
	}

    return returnWithTitle({repositoryName,<PullRequestList pullRequests={pullRequests}/>})
}


