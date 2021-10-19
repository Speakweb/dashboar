import {Text} from "ink";
import React from "react";

export interface PullRequest {
	title: string
	links: {
		html: {
			href: string
		}
	}
}

export const PullRequestList: ({pullRequests}: { pullRequests: PullRequest[] }) => React.ReactElement[] = (
	{
		pullRequests
	}
) => {
	let PullReqList: React.ReactElement[] = []
	pullRequests.forEach(PullRequest => {
			PullReqList.push(<Text key={PullRequest.title}>{PullRequest.title}</Text>)
		}
	)
	return PullReqList
}
