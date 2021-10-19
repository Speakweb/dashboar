import {PullRequest, PullRequestList} from "./pull-request-list";
import React, {useEffect, useState} from "react";

export function PullRequests({fetchFunction}: {
    fetchFunction: () => Promise<PullRequest[]>
}) {
    const [pullRequests, setPulLRequests] = useState<PullRequest[]>([]);
    useEffect(() => {
        setInterval(() => {
			const promise = fetchFunction();
			promise.then(values => setPulLRequests(values))
        }, 5000)
    }, [])
    return <PullRequestList pullRequests={pullRequests}/>;
}
