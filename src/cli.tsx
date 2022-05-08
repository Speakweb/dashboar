#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import Ui from './ui';
import {join} from "path";
import {fetchPullRequests} from "./lib/fetchBitbucket";
import {DashboarConfig} from "./lib/config";
import { resolveStoreValues } from './lib/resolveStoreValues';

const loadedConfiguration: DashboarConfig = require(join(process.cwd(), './dashboar-config'));

const storeFileIsEncrypted = !process.argv.includes('--plaintext-store')

const runCLI = async () => {
	const storeValues = await resolveStoreValues({config: loadedConfiguration, storeFileIsEncrypted});

	render(<Ui
		config={loadedConfiguration}
		storeValues={storeValues}
		pullRequestFetchFunction={config => () => fetchPullRequests(config)}
	/>);
}

runCLI();