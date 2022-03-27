#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import Ui from './ui';
import {join} from "path";
import {fetchPullRequests} from "./lib/fetch-bitbucket";
import {Config} from "./lib/config";
import { getStoreCredentials } from './lib/get-store-credentials';

const loadedConfiguration: Config = require(join(process.cwd(), './dashboar-config'));

const runCLI = async () => {
	await getStoreCredentials();

	render(<Ui
		config={loadedConfiguration}
		pullRequestFetchFunction={config => () => fetchPullRequests(config)}
	/>);
}

runCLI();