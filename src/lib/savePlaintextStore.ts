import {StoreValues} from "./config";
import {promises as fs} from "fs";

export const savePlaintextStore = async ({storeValues, filePath}: { storeValues: StoreValues, filePath: string }) => {
    await fs.writeFile(filePath, JSON.stringify(storeValues));
}
