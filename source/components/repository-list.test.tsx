import test from "ava";
import {render} from "ink-testing-library";
import RepositoriesResponse from "../test/fixtures/repositories-response";
import React from "react";
import RepositoryList from "./repository-list";
import {expectedResult} from "../lib/get-repository-names.test";

test('repositoryList', t => {
	const {lastFrame} = render(<RepositoryList repositories={RepositoriesResponse.data.values}/>);
	t.is(lastFrame(), expectedResult.join('\n'));
});
