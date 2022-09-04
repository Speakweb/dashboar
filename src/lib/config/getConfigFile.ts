import { join } from "path";
import { DashboarConfig } from "./DashboarConfig";
const requireFromUrl = require('require-from-url/sync');

const getFileFromUrl = (path: string) => {
    return new Promise<DashboarConfig>(async (resolve, reject) => {
        try {
            const configFile: DashboarConfig = requireFromUrl(path);
            resolve(configFile);
        } catch (error) {
            reject(error);
        }
    });
};

export const getConfigFile = async () => {
    const commandArgs = process.argv.slice(2); // slices the command args array so that only the arguments are remaining
    const configFileIdx = commandArgs.indexOf("--config-file");
    if (configFileIdx < 0 || !commandArgs.length) {
		return require(join(process.cwd(), "./dashboar-config"));
    }

    const configFilePath = commandArgs[configFileIdx + 1] || "./dashboar-config";
    const regex = new RegExp("^(http|https)://", "i");

	let configFile: DashboarConfig ;
    try {
        if (regex.test(configFilePath)) {
            configFile = await getFileFromUrl(configFilePath);
        } else {
            configFile = require(join(process.cwd(), configFilePath));
        }
    } catch (error) {
		console.error(error);
        throw new Error("There was an error loading the custom config file. Using the default dashboar-config-languagetrainer.js\n");
    }
	return configFile;
};
