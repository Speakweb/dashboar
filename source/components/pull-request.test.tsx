import test from "ava";
import {render} from "ink-testing-library";
import PullRequestsResponse from "../test/fixtures/pull-requests-response";
import React from "react";
import {PullRequests} from "./pull-requests";
export const releaseDate = 'Release/oct 14 2021';

test("It fetches pull requests on startup", t => {
	const {lastFrame} = render(<PullRequests fetchFunction={() => Promise.resolve(PullRequestsResponse.data.values)}/>)
	t.is(lastFrame(), releaseDate)
});
