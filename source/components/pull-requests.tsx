import {PullRequest, PullRequestList} from "./pull-request-list";
import React, {useEffect, useState} from "react";

const ONE_MINUTE = 60000;

export function PullRequests({fetchFunction}: {
    fetchFunction: () => Promise<PullRequest[]>
}) {
    const [pullRequests, setPulLRequests] = useState<PullRequest[]>([]);
    useEffect(() => {
		fetchFunction().then(values => setPulLRequests(values))
		setInterval(() => {
			fetchFunction().then(values => setPulLRequests(values))
        }, ONE_MINUTE)
    }, [])
    return <PullRequestList pullRequests={pullRequests}/>;
}
