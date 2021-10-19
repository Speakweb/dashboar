import test from "ava";
import {render} from "ink-testing-library";
import Ui from "./ui";
import PullRequestsResponse from "./test/fixtures/pull-requests-response";
import React from "react";
import {releaseDate} from "./components/pull-request.test";

test("It renders the whole app", t => {
	const {lastFrame} = render(<Ui
		config={{commands: [ `echo "icecream"` ], pullRequestConfigs: [{workspace: '', repo: ''}]}}
		pullRequestFetchFunction={() => () => Promise.resolve(PullRequestsResponse.data.values)}/>
	);

	t.is(lastFrame(),
		`icecream
		${releaseDate}`)
})
