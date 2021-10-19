#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App, {Config} from './ui';
import {join} from "path";

const config: Config = require(join(process.cwd(), './dashboar-config'));

render(<App config={config}/>);
