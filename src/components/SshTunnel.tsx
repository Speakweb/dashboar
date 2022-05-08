import tunnel from 'tunnel-ssh';
import {Text} from 'ink'
import React, {useEffect, useState} from "react";

export type SshTunnelProps = {
	username: string,
	password: string,
	host: string,
	port: 22,
	dstHost: string,
	dstPort: 27017,
	localHost: string,
	localPort: number
};
export const SshTunnel = (
	{
		username,
		password,
		host,
		port,
		dstHost,
		dstPort,
		localHost,
		localPort,
	}: SshTunnelProps) => {
	const [latestMessage, setLatestMessage] = useState<any>();
	const [latestError, setLatestError] = useState<any>();
	useEffect(() => {
		const config = {
			username,
			password,
			host,
			port,
			dstHost,
			dstPort,
			localHost,
			localPort,
		};

		tunnel(config, function (error, server) {
			if (error) {
				setLatestError(error);
				return;
			}
			setLatestMessage(`Attempting tunnel to ${host}`)
			server.on('error', (e) => {
				setLatestError(e)
			});
			server.on('connection', () => {
				// I don't actually think this always only fires on successful connection, but it sometimes does
				setLatestMessage(`Successfully tunnelled to ${username}@${host}:${port} ${localPort}:${localHost}:${dstPort} !!`);
			})
		});

	}, [username, password, host, port, dstHost, dstPort, localHost, localPort]);
	if (latestError) {
		return <Text>{JSON.stringify(latestError)}</Text>
	}
	return <Text>{latestMessage}</Text>
}
