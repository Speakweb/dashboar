import test from 'ava';
import RepositoriesResponse from './fixtures/repositories-response'
import getRepositoryNames from '../lib/getRepositoryNames'
import React from 'react';
import {render} from 'ink-testing-library';
import RepositoryList from "../RepositoryList";
import PullRequestsResponse from "./fixtures/pull-requests-response";
import {PullRequestList} from "../boards/pull-request-list";
import {PullRequests} from "../PullRequest";
import DashBoards from '../ui'

const releaseDate = 'Release/oct 14 2021';

const expectedResult = [
	"Drupal TASWeb Authentication Module",
	"Internal Events",
	"Brand Stores CMS",
	"activeCollab",
	"Montreal iPad",
	"Web Project Plans",
	"Friday Sessions",
	"Arcteryx.com Behat Test Suite",
	"WebScripts (pre-2011)",
	"Sales Meeting (pre-2013)"
];


test("getRepositoryNames", t => {
	const actualResponse = getRepositoryNames(RepositoriesResponse as BitBucketResponse.RootObject);
	t.deepEqual(actualResponse, expectedResult);

})


test('repositoryList', t => {
	const {lastFrame} = render(<RepositoryList repositories={RepositoriesResponse.data.values}/>);
	t.is(lastFrame(), expectedResult.join('\n'));
});

test("rendering of pull requests", t => {
	const {lastFrame} = render(<PullRequestList pullRequests={PullRequestsResponse.data.values}/>);
	t.is(lastFrame(), releaseDate);
});


test("It fetches pull requests on startup", t => {
	const {lastFrame} = render(<PullRequests fetchFunction={() => Promise.resolve(PullRequestsResponse.data.values)}/>)
	t.is(lastFrame(), releaseDate)
});

test("It renders the whole app", t => {
	const {lastFrame} = render(<DashBoards
		config={{commands: [ `echo "icecream"` ]}}
		pullRequestFetchFunction={() => Promise.resolve(PullRequestsResponse.data.values)}/>
	);

	t.is(lastFrame(),
		`icecream
		${releaseDate}`)
})

