import test from 'ava';
import response from  './fixtures/response'
import getRepositoryNames from '../lib/getRepositoryNames'



test("things", t => {
	const expectedResult: string[] = [
		// What do I expect here?
	];
	const actualResponse = getRepositoryNames(response as BitBucketResponse.RootObject);
	t.is(actualResponse, expectedResult);
})
