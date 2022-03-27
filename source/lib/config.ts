export type Config = { commands: string[], pullRequestConfigs: { workspace: string, repo: string }[] };

type StoreSshTunnel = { storeKey: string };
type StoreCommand = {
  storeKeys: {
    databaseHost: {
      type: string 
    }
  },
  command: any
};

export type Store = {
  databaseConnectionString: string,
  sshString: string
};

export type StoreKey = 'databaseConnectionString' | 'sshString';

export type StoreConfig = {
  sshTunnels: [StoreSshTunnel],
  commands: [StoreCommand],
  prompts: Store
};