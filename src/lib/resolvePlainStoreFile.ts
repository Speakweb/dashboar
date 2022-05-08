import {Interface} from "readline";
import {DashboarConfig} from "./config";
import {readStoreFromPlainFile} from "./readStoreFromPlainFile";
import {savePlaintextStore} from "./savePlaintextStore";
import {plainStoreFilePath, resolveAllStoreValues} from "./resolveStoreValues";

export async function resolvePlainStoreFile({
                                                storeFileExists,
                                                cli,
                                                config
                                            }: { storeFileExists: boolean, cli: Interface, config: DashboarConfig }) {
    if (storeFileExists) {
        const existingStore = await readStoreFromPlainFile(plainStoreFilePath);
        const storeValues = await resolveAllStoreValues({currentStore: existingStore, config, cli});
        await savePlaintextStore({storeValues, filePath: plainStoreFilePath})
        return storeValues;
    } else {
        const storeValues = await resolveAllStoreValues({config, currentStore: {}, cli});
        await savePlaintextStore({storeValues, filePath: plainStoreFilePath})
        return storeValues;
    }
}
