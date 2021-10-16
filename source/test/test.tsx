import React from 'react';
import chalk from 'chalk';
import test from 'ava';
import {render} from 'ink-testing-library';
import App from '../ui';
import { readFileSync } from 'fs';
const response = JSON.parse(readFileSync('./fixtures/repositories.json').toString('utf8'))

test('greet unknown user', t => {
	const {lastFrame} = render(<App/>);

	t.is(lastFrame(), chalk`Hello, {green Stranger}`);
});

test('greet user with a name', t => {
	const {lastFrame} = render(<App/>);

	t.is(lastFrame(), chalk`Hello, {green Jane}`);
});

test("getRepositoryNames", t => {
	const expectedResult = [
		// What do I expect here?
	];
	const actualResponse = getRepositoryNames(response as BitBucketResponse.RootObject);
	t.is(actualResponse, expectedResult);
})
