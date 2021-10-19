#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App, {Config} from './ui';
import {join} from "path";
import {fetchPullRequests} from "./fetch-bitbucket";

const loadedConfiguration: Config = require(join(process.cwd(), './dashboar-config'));

render(<App
	config={loadedConfiguration}
	pullRequestFetchFunction={config => () => fetchPullRequests(config)}
/>);
