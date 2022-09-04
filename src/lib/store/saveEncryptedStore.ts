import {StoreValues} from "../config/config";
import {encrypt} from "./encryptDecrypt";
import {promises as fs} from "fs";
import {encryptedStoreFilePath} from "./resolveStoreValues";

export const saveEncryptedStore = async ({storeValues, password}: { storeValues: StoreValues, password: string }) => {
    const encryptedData = encrypt(password, JSON.stringify(storeValues));
    await fs.writeFile(encryptedStoreFilePath, JSON.stringify(encryptedData));
}
