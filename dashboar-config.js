module.exports = {
	pullRequestConfigs: [],
	sshTunnels: [
		// Tell dashboar that it’s needs to be use whatever widget is used for ssh tunnels
		{
			configKey: "LanguageTrainer keycloak ssh tunnel",
			storeParameters: {
				keyCloakSshTunnel: {
					type: "string",
					prompt: "Keycloak ssh tunnel (ex. ssh -L 8080:localhost:8080 root@165.227.49.247):"
				},
			},
			command: ({keyCloakSshTunnel}) => keyCloakSshTunnel
		},
	],
	postgresqlConnections: [
		{
			configKey: "LanguageTrainer Postgres database",
			storeParameters: {
				postgresqlHost: "languagetrainer PostgreSQL host",
				postgresqlUsername: "languagetrainer PostgreSQL username",
				postgresqlPassword: "languagetrainer PostgreSQL password",
				postgresqlDatabase: "languagetrainer PostgreSQL database",
				postgresqlPort: {
					type: 'number',
					prompt: "languagetrainer PostgreSQL port"
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
