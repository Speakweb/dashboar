import test from "ava";
import {render} from "ink-testing-library";
import PullRequestsResponse from "../test/fixtures/pull-requests-response";
import React from "react";
import {PullRequestList} from "./pull-request-list";
import {releaseDate} from "./pull-request.test";

test("rendering of pull requests", t => {
	const {lastFrame} = render(<PullRequestList pullRequests={PullRequestsResponse.data.values}/>);
	t.is(lastFrame(), releaseDate);
});
