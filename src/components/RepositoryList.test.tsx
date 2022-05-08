import test from "ava";
import {render} from "ink-testing-library";
import RepositoriesResponse from "../test/fixtures/repositoriesResponse";
import React from "react";
import RepositoryList from "./RepositoryList";
import {expectedResult} from "../lib/getRepositoryNames.test";

test('repositoryList', t => {
	const {lastFrame} = render(<RepositoryList repositories={RepositoriesResponse.data.values}/>);
	t.is(lastFrame(), expectedResult.join('\n'));
});
