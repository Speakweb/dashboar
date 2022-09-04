#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import RenderConfigAndStore from './RenderConfigAndStore';
import {fetchPullRequests} from "./lib/bitbucket/fetchBitbucket";
import { resolveStoreValues } from './lib/store/resolveStoreValues';
import {DashboarConfig} from "./lib/config/DashboarConfig";
import { getConfigFile } from './lib/config/getConfigFile';

const storeFileIsEncrypted = process.argv.includes('--encrypted-store');

const runCLI = async () => {
	const loadedConfiguration: DashboarConfig = await getConfigFile();

	const storeValues = await resolveStoreValues({config: loadedConfiguration, storeFileIsEncrypted});

	render(<RenderConfigAndStore
		config={loadedConfiguration}
		storeValues={storeValues}
		pullRequestFetchFunction={config => () => fetchPullRequests(config)}
	/>);
}

runCLI();
