#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import Ui from './ui';
import {join} from "path";
import {fetchPullRequests} from "./lib/fetch-bitbucket";
import {Config} from "./lib/config";

const loadedConfiguration: Config = require(join(process.cwd(), './dashboar-config'));

render(<Ui
	config={loadedConfiguration}
	pullRequestFetchFunction={config => () => fetchPullRequests(config)}
/>);
