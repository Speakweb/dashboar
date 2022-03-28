import readline from 'readline';
import { promises as fs, existsSync } from "fs";
import { join } from "path";
import { StoreConfig, Store, StoreKey } from "./config";

const loadedConfiguration: StoreConfig = require(join(
  process.cwd(),
  "./dashboar.config.epub-finder.js"
));

const storeFilePath = "dashboar-store";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const getStoreCredentials = async () => {
  if (existsSync(storeFilePath)) {
    //const buffer = fs.readFileSync(storeFilePath);
    //const data: Store = JSON.parse(buffer.toString());
    // todo: check if values from config file are present in store file
  } else {
    console.log("\nCould not find input file, creating one: ./dashboar-store");

    const values: Store = {
      databaseConnectionString: "",
      sshString: "",
    };

    const prompt = async (key: StoreKey) => {
      return new Promise<void>((resolve, reject) => {
        rl.question(loadedConfiguration.prompts[key], async (dbString: string) => {
            values[key] = dbString;
            try {
              await fs.writeFile(storeFilePath, JSON.stringify(values));
              console.log(`Wrote ${key} to store`);
              resolve();
            } catch {
              reject();
            }
          }
        );
      });
    };

    let key: StoreKey | any;
    for (key in loadedConfiguration.prompts) {
      await prompt(key);
    }
    rl.close();
  }
};