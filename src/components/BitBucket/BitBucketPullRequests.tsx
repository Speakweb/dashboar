import {PullRequest, BitBucketPullRequestList} from "./BitBucketPullRequestList";
import {Text} from "ink";
import React, {useEffect, useState} from "react";

const ONE_MINUTE = 60000;

export function BitBucketPullRequests({fetchFunction}: {
    fetchFunction: () => Promise<PullRequest[]>
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

	if (fetchingError) {
		return <Text>{fetchingError}</Text>
	}
    return  <BitBucketPullRequestList pullRequests={pullRequests}/>
}
