module.exports = {
	pullRequestConfigs: [],
	sshTunnels: [
		// Tell dashboar that it’s needs to be use whatever widget is used for ssh tunnels
		{
			configKey: "LanguageTrainer keycloak ssh tunnel",
			storeParameters: {
				keyCloakSshTunnel: {
					sources: {
						type: "string",
						prompt: "Keycloak ssh tunnel (ex. ssh -L 8080:localhost:8080 root@165.227.49.247):"
					}
				},
			},
			command: ({keyCloakSshTunnel}) => keyCloakSshTunnel
		},
	],
	postgresqlConnections: [
		{
			configKey: "LanguageTrainer Postgres database",
			storeParameters: {
				postgresqlHost: {
					sources: {
						sources: "Environment",
						envKey: "TYPEORM_HOST"
					}
				},
				postgresqlUsername: {
					sources: {
						sources: "Environment",
						envKey: "TYPEORM_USERNAME"
					}
				},
				postgresqlPassword: {
					sources: {
						sourceType: "Environment",
						envKey: "TYPEORM_PASSWORD"
					}
				},
				postgresqlDatabase: {
					sources: {
						sources: "Environment",
						envKey: "TYPEORM_DATABASE"
					}
				},
				postgresqlPort: {
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
