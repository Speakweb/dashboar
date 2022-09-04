import {HealthCheckConfig} from "../lib/config";
import React, {useEffect, useState} from "react";
import {DashboarPanel} from "./DashboarPanel";
import {Text} from "ink";
import fetch from 'node-fetch';

export class HealthCheckPanel extends DashboarPanel<HealthCheckConfig> {
	errorMessage(): string | undefined {
		// TODO: Check for valid config
		return undefined;
	}

	pane() {
		const configValues = this.configEntry as unknown as {
			url: string;
			failureMessage: string;
			successMessage: string;
		};
		return <HealthCheckConnection
			key={this.configEntry.configKey}
			{...configValues}
		/>;
    }
}

export const HealthCheckConnection = (
	{
		url,
		failureMessage, successMessage
	}: {
		url: string;
		failureMessage: string;
		successMessage: string;
	}) => {
	const [latestMessage, setLatestMessage] = useState<JSX.Element>(<Text>Loading...</Text>);
	const [latestError, setLatestError] = useState<any>();

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const response = await fetch(url);
				if (response.ok) {
					setLatestMessage(<Text>{successMessage}</Text>);
				} else {
					setLatestMessage(<Text>{failureMessage}</Text>)
				}
			} catch(e) {
				setLatestMessage(<Text>{failureMessage}</Text>);
			}
		}

		const timer = setInterval(fetchStatus, 5000);
		fetchStatus().catch(setLatestError);
		return () => clearInterval(timer);
	}, [url, failureMessage, successMessage]);

	if (latestError) {
		return <Text>{JSON.stringify(latestError)}</Text>
	}

	return <Text>{latestMessage}</Text>
}
