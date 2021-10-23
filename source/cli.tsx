#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import Ui from './ui';
import {join} from "path";
import {fetchPullRequests} from "./lib/fetch-bitbucket";
import {Config} from "./lib/config";
import {findOs} from "./lib/findOs";

function giveConfigFile() {
	if (findOs() === "win32") {
		return './dashboar.windows.config.js'
	}

	if (findOs() === "MacOrLnx") {
		return './dashboar.unix.config.js'
	}
	throw new Error('unsupported platform/OS' + findOs())
}

const loadedConfiguration: Config = require(join(process.cwd(), giveConfigFile()));

render(<Ui
	config={loadedConfiguration}
	pullRequestFetchFunction={config => () => fetchPullRequests(config)}
/>);
