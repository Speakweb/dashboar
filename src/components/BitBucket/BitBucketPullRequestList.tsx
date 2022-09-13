import {Text} from "ink";
import React from "react";
import Link from 'ink-link';

export interface BitBucketPullRequest {
	title: string
	links: {
		html: {
			href: string
		}
	}
}

export const BitBucketPullRequestList: React.FC<{ pullRequests: BitBucketPullRequest[] }> = ({pullRequests}) => {
	return <>
		{
			pullRequests.map(({title, links: {html: {href}}}) => <Link key={title} url={href}> <Text>{title.trim()}</Text></Link>)
		}

	</>
}
