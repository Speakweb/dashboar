import readline from "readline";
import { promises as fs, existsSync } from "fs";
import { join } from "path";
import { StoreConfig, Store, StoreKey } from "./config";

const loadedConfiguration: StoreConfig = require(join(
  process.cwd(),
  "./dashboar.config.epub-finder.js"
));

const storeFilePath = "dashboar-store";

export const getStoreCredentials = async () => {
  if (existsSync(storeFilePath)) {
    //const buffer = fs.readFileSync(storeFilePath);
    //const data: Store = JSON.parse(buffer.toString());
    // todo: check if values from config file are present in store file
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\nCould not find input file, creating one: ./dashboar-store");

    const values: Store = {
      databaseConnectionString: "",
      sshString: "",
    };

    // Prompts the user for a new dashboar-store password
    const getStorePassword = async () => {
      return new Promise<void>((resolve, reject) => {
        rl.question("What is the password for the store? ", async (pw: string) => {
          if (!pw.length) reject();
          else {
            console.log("Created dashboar-store");
            // todo: encrypt file with pw

            resolve();
          }
        });
      });
    };

    // Prompts the user for values based off the questions in the config file
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
        });
      });
    };

    await getStorePassword();
    let key: StoreKey | any;
    for (key in loadedConfiguration.prompts) {
      await prompt(key);
    }
    rl.close();
  }
};
