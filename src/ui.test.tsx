import test from "ava";
import {render} from "ink-testing-library";
import Ui from "./ui";
import PullRequestsResponse from "./test/fixtures/pullRequestsResponse";
import React from "react";
import {releaseDate} from "./components/pull-request.test";

test("It renders the whole app", t => {
	const {lastFrame} = render(<Ui
		storeValues={{}}
		config={{pullRequestConfigs: []}}
		pullRequestFetchFunction={() => () => Promise.resolve(PullRequestsResponse.data.values)}/>
	);

	// This test is broken, because I'm too lazy to convert the old pullRequestConfigs type into the new one
	// Also this test doesn't consider the store
	t.is(lastFrame(),
		`icecream
		${releaseDate}`)
})
