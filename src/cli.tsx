#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import RenderConfigWithStore from './RenderConfigWithStore';
import {fetchPullRequests} from "./lib/bitbucket/fetchBitbucket";
import { resolveStoreValues } from './lib/store/resolveStoreValues';
import {DashboarConfig} from "./lib/config/DashboarConfig";
import { getConfigFile } from './lib/config/getConfigFile';

const storeFileIsEncrypted = process.argv.includes('--encrypted-store');

const runCLI = async () => {
	const loadedConfiguration: DashboarConfig = await getConfigFile();

	const storeValues = await resolveStoreValues({config: loadedConfiguration, storeFileIsEncrypted});

	render(<RenderConfigWithStore
		config={loadedConfiguration}
		storeValues={storeValues}
		pullRequestFetchFunction={config => () => fetchPullRequests(config)}
	/>);
}

runCLI()
	.then(() => console.log('done'))
	.catch(error => console.error(error));
