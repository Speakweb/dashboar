import test from 'ava';
import RepositoriesResponse from './fixtures/repositories-response'
import getRepositoryNames from '../lib/getRepositoryNames'
import React from 'react';
import {render} from 'ink-testing-library';
import RepositoryList from "../RepositoryList";
import PullRequestsResponse from "./fixtures/pull-requests-response";
import BitBucketRepository = BitBucketResponse.BitBucketRepository;

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


test('greet user with a name', t => {
	const {lastFrame} = render(<RepositoryList repositories={RepositoriesResponse.data.values}/>);
	t.is(lastFrame(), expectedResult.join('\n'));
});

function PulLRequestList() {
	return null;
}

test("rendering of pull requests", t => {
	const {lastFrame} = render(<PulLRequestList pullRequests={PullRequestsResponse.data.values}/>);
	t.is(lastFrame(), 'Release/oct 14 2021');
})
