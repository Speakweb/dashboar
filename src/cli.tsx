#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import Ui from './ui';
import {fetchPullRequests} from "./lib/fetchBitbucket";
import { resolveStoreValues } from './lib/resolveStoreValues';
import {DashboarConfig} from "./lib/DashboarConfig";
import { getConfigFile } from './lib/getConfigFile';

const storeFileIsEncrypted = process.argv.includes('--encrypted-store');

const runCLI = async () => {
	const loadedConfiguration: DashboarConfig = await getConfigFile();

	const storeValues = await resolveStoreValues({config: loadedConfiguration, storeFileIsEncrypted});

	render(<Ui
		config={loadedConfiguration}
		storeValues={storeValues}
		pullRequestFetchFunction={config => () => fetchPullRequests(config)}
	/>);
}

runCLI();
