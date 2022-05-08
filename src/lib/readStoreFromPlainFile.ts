import {promises as fs} from "fs";

export const readStoreFromPlainFile = async (filePath: string) => {
    const text = (await fs.readFile(filePath)).toString();
    return JSON.parse(text)
}
