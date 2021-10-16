import test from 'ava';
import response from './fixtures/response'
import getRepositoryNames from '../lib/getRepositoryNames'
import React from 'react';
import {render} from 'ink-testing-library';
import RepositoryList from "../RepositoryList";

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
	const actualResponse = getRepositoryNames(response as BitBucketResponse.RootObject);
	t.deepEqual(actualResponse, expectedResult);

})


test('greet user with a name', t => {
	const {lastFrame} = render(<RepositoryList repositories={response.data.values}/>);
	t.is(lastFrame(), expectedResult.join('\n'));
});
