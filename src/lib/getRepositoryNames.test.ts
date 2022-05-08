import test from "ava";
import RepositoriesResponse from "../test/fixtures/repositoriesResponse";
import getRepositoryNames from "./getRepositoryNames";

export const expectedResult = [
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
