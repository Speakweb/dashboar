import {Interface} from "readline";
import {readStoreFromEncryptedFile} from "./readStoreFromEncryptedFile";
import {saveEncryptedStore} from "./saveEncryptedStore";
import {getStorePassword} from "./getStorePassword";
import {encryptedStoreFilePath, resolveAllStoreValues} from "./resolveStoreValues";
import {DashboarConfig} from "../config/DashboarConfig";

export async function resolveEncryptedStoreFile(storeFileExists: boolean, cli: Interface, config: DashboarConfig) {
    if (storeFileExists) {
        const {storeValues: existingStore, password} = await readStoreFromEncryptedFile({cli});
        const storeValues = await resolveAllStoreValues({currentStore: existingStore, config, cli});
        await saveEncryptedStore({storeValues, password})
        return storeValues;
    } else {
        const storeValues = await resolveAllStoreValues({config, currentStore: {}, cli});
        await saveEncryptedStore({
            storeValues,
            password: await getStorePassword({cli, prompt: `Set the password for ${encryptedStoreFilePath}`})
        })
        return storeValues;
    }
}
