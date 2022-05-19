import { join } from "path";
import { DashboarConfig } from "./DashboarConfig";
import fs from "fs";
const fsPromises = fs.promises;

// using 'import' syntax with node-fetch version 3 causes an error
// but using 'require' with version 2 works
const fetch = require("node-fetch");

const getFileFromUrl = (path: string) => {
    return new Promise<DashboarConfig>(async (resolve, reject) => {
        try {
            const res = await fetch(path);
            const responseArrayBuffer = await res.arrayBuffer();
            const filePath = join(process.cwd(), "./dashboar-config.custom.js");
            await fsPromises.writeFile(filePath, Buffer.from(responseArrayBuffer));
            const configFile = require(filePath);
            resolve(configFile);
        } catch (error) {
            reject(error);
        }
    });
};

export const getConfigFile = async () => {
    const commandArgs = process.argv.slice(2); // slices the command args array so that only the arguments are remaining
    const configFileIdx = commandArgs.indexOf("configFile");
    let configFile: DashboarConfig = require(join(process.cwd(), "./dashboar-config"));
    if (configFileIdx < 0 || !commandArgs.length) {
        return configFile;
    }

    const configFilePath = commandArgs[configFileIdx + 1] || "./dashboar-config";
    const regex = new RegExp("^(http|https)://", "i");

    try {
        if (regex.test(configFilePath)) {
            configFile = await getFileFromUrl(configFilePath);
        } else {
            configFile = require(join(process.cwd(), configFilePath));
        }
    } catch (error) {
        console.log("There was an error loading the custom config file. Using the default dashboar-config.js\n", error);
    } finally {
        return configFile;
    }
};
