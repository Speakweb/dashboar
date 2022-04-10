import test from "ava";
import {render} from "ink-testing-library";
import PullRequestsResponse from "../test/fixtures/pullRequestsResponse";
import React from "react";
import {PullRequestList} from "./PullRequestList";
import {releaseDate} from "./pull-request.test";

test("rendering of pull requests", t => {
	const {lastFrame} = render(<PullRequestList pullRequests={PullRequestsResponse.data.values}/>);
	t.is(lastFrame(), releaseDate);
});
