import readline from "readline";
import { promises as fs, existsSync } from "fs";
import { join } from "path";
import { encrypt, decrypt } from "./encrypt-decrypt";
import { StoreConfig, Store, StoreKey } from "./config";

const loadedConfiguration: StoreConfig = require(join(
  process.cwd(),
  "./dashboar.config.epub-finder.js"
));

const storeFilePath = "dashboar-store";

export const getStoreCredentials = async () => {
  const inputValues: Store = {
    databaseConnectionString: "",
    sshString: "",
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Prompts the user for a new dashboar-store password
  const getStorePassword = async () => {
    return new Promise<string>((resolve, reject) => {
      rl.question("What is the password for the store? ", async (pw: string) => {
        if (!pw.length) reject("Store password cannot be empty");
        else {
          if (!existsSync(storeFilePath)) console.log("Created dashboar-store");
          resolve(pw);
        }
      });
    });
  };

  // Prompts the user for values based off the questions in the config file
  const prompt = async (key: StoreKey) => {
    return new Promise<void>((resolve, reject) => {
      rl.question(loadedConfiguration.prompts[key], async (dbString: string) => {
        inputValues[key] = dbString;
        try {
          await fs.writeFile(storeFilePath, JSON.stringify(inputValues));
          console.log(`Wrote ${key} to store`);
          resolve();
        } catch {
          reject();
        }
      });
    });
  };

  if (existsSync(storeFilePath)) {
    const pw = await getStorePassword();
    const buffer = await fs.readFile(storeFilePath);
    const encryptedData = buffer.toString().replace(/['"]+/g, "");
    const decryptedData = decrypt(pw, encryptedData);
    if (decryptedData === null) {
      console.log('Incorrect Password');
      rl.close();
    } else {
      //const data: Store = JSON.parse(decryptedData);
      // todo: check if values from config file are present in store file
    }
  } else {
    console.log("\nCould not find input file, creating one: ./dashboar-store");

    try {
      const pw = await getStorePassword();

      let key: StoreKey | any;
      for (key in loadedConfiguration.prompts) {
        await prompt(key);
      }

      const encryptedData = encrypt(pw, JSON.stringify(inputValues));
      await fs.writeFile(storeFilePath, JSON.stringify(encryptedData));

      rl.close();
    } catch (err) {
      console.error(err);
    }
  }
};
