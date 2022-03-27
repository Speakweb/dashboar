import test from "ava";
import { getStoreCredentials } from "./get-store-credentials";
import fs from 'fs';
import { Store } from "./config";

/* todo:
//Writing to store file and reading it
test(“Writes to a store file”, () => {})
test(“Reads from a store file with the correct password”, () => {})
test(“Cannot read from the store file with an incorrect password”, () => {})
*/

const storeFilePath = 'dashboar-store';

// Prompting the user for store inputs
test("Prompts to user for values if the store is empty", async (t) => {
    await getStoreCredentials();
    t.truthy(fs.existsSync(storeFilePath));

    const buffer = fs.readFileSync(storeFilePath);
    const data: Store = JSON.parse(buffer.toString());
    t.is(data.databaseConnectionString, 'test_db'); // assuming user input is 'test_db'
    t.is(data.sshString, 'test_ssh'); // assuming user input is 'test_ssh'
});
//test("Does not prompt the user for values which are already present", async (t) => {});