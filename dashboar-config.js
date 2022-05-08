module.exports = {
	pullRequestConfigs: [],
	sshTunnels: [
		// Tell dashboar that it’s needs to be use whatever widget is used for ssh tunnels
		{
			configKey: "LanguageTrainer keycloak ssh tunnel",
			storeParameters: {
				username: "ssh tunnel username eg. root",
				password: "ssh tunnel password eg. icecream99",
				host: "ssh tunnel host eg. 165.227.49.247",
				port: "ssh tunnel port eg. 22",
				dstHost: "ssh tunnel destination host eg. 127.0.0.1",
				dstPort: "ssh tunnel destination port eg. 8080",
				localHost:"ssh tunnel local host eg. 127.0.0.1",
				localPort: "ssh tunnel destination port eg. 22"
			},
			command: ({keyCloakSshTunnel}) => keyCloakSshTunnel
		},
	],
	postgresqlConnections: [
		{
			configKey: "LanguageTrainer Postgres database",
			storeParameters: {
				host: {
					sources: {
						sources: "Environment",
						envKey: "TYPEORM_HOST"
					}
				},
				user: {
					sources: {
						sources: "Environment",
						envKey: "TYPEORM_USERNAME"
					}
				},
				password: {
					sources: {
						sourceType: "Environment",
						envKey: "TYPEORM_PASSWORD"
					}
				},
				database: {
					sources: {
						sources: "Environment",
						envKey: "TYPEORM_DATABASE"
					}
				},
				port: {
					type: 'number',
					sources: {
						sources: "Environment",
						envKey: "TYPEORM_PORT"
					}
				}
			},
		}
	],
	repeatedCommands: [
		{
			configKey: "PingKeycloak",
			// Ping the keycloak instance
			command: 'echo "Pinging keycloak on localhost:8080"; ping localhost:8080',
		},
	]
}
