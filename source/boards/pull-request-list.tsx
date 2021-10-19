import {Text} from "ink";
import React from "react";
import React from 'react';
import {render, Text} from 'ink';
import Link from 'ink-link';

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
			PullReqList.push(<Link url={PullRequest.links.html.href}> <Text
				key={PullRequest.title}>{PullRequest.title}</Text></Link>)
		}
	)
	return PullReqList
}
