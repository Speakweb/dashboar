import test from 'ava';
import response from './fixtures/response'
import getRepositoryNames from '../lib/getRepositoryNames'


test("getRepositoryNames", t => {
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
	const actualResponse = getRepositoryNames(response as BitBucketResponse.RootObject);
	t.deepEqual(actualResponse, expectedResult);

})
