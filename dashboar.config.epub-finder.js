module.exports = {
    sshTunnels: [
      // Tell dashboar that it’s needs to be use whatever widget is used for ssh tunnels
      {
        storeKey: "keyCloakSshTunnel", // Tell dashboar that it needs this value to be present in the encrypted store.  If it isn’t, then query it
      },
    ],
    commands: [
      {
        storeKeys: {
          databaseHost: { type: "string" }, // StoreKeys can have type hints if they want
        },
        command: ({ databaseHost }) => `ping ${databaseHost}`, // commands can be function which receive their store args as parameters
      },
    ],
    prompts: {
      databaseConnectionString: "What is the database connection string? ",
      sshString: "What is the SSH string? "
    }
  };
  