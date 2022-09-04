import {Interface} from "readline";
import {StoreValues} from "../config/config";
import {getStorePassword} from "./getStorePassword";
import {promises as fs} from "fs";
import {decrypt} from "./encryptDecrypt";
import {encryptedStoreFilePath} from "./resolveStoreValues";

export const readStoreFromEncryptedFile = async ({cli}: { cli: Interface }): Promise<{ storeValues: StoreValues, password: string }> => {
    /**
     * The flat key/value pairs which which are resolved by loading the store file and prompting if necessary
     */
    let password = "";
    let decryptedData = null;
    while (decryptedData === null) {
        password = await getStorePassword({cli, prompt: `What is the password for ${encryptedStoreFilePath}?`});
        const storeFileBytes = await fs.readFile(encryptedStoreFilePath);
        const encryptedData = storeFileBytes.toString().replace(/['"]+/g, "");
        decryptedData = decrypt(password, encryptedData);
        if (decryptedData === null) {
            console.log(`Invalid store password for ${encryptedStoreFilePath}`)
        }
    }
    const storeValues: StoreValues = JSON.parse(decryptedData);
    return {storeValues, password}
};
