// Prompts the user for a new dashboar-store password
import {Interface} from "readline";
import {existsSync} from "fs";
import {encryptedStoreFilePath} from "./resolveStoreValues";

export const getStorePassword = async ({cli, prompt}: { cli: Interface, prompt: string }) => {
    return new Promise<string>((resolve, reject) => {
        cli.question(prompt, async (pw: string) => {
            if (!pw.length) reject("Store password cannot be empty");
            else {
                if (!existsSync(encryptedStoreFilePath)) console.log(`Created ${encryptedStoreFilePath}`);
                resolve(pw);
            }
        });
    });
};
