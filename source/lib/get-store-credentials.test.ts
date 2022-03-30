import test from "ava";
const sinon = require("sinon");
import { getStoreCredentials } from "./get-store-credentials";
import fs from "fs";
import readline from "readline";
import { join } from "path";
import { StoreConfig, Store } from "./config";

const loadedConfiguration: StoreConfig = require(join(
  process.cwd(),
  "./dashboar.config.epub-finder.js"
));
const storeFilePath = "dashboar-store";
let readlineStub: any;

test.afterEach(() => {
  if (fs.existsSync(storeFilePath)) fs.unlinkSync(storeFilePath);
  if (readlineStub) readlineStub.restore();
});

test.serial("Prompts the user for values if the store is empty", async (t) => {
  let results: any = [];

  const readlineInterfaceStub = {
    question: sinon.stub().callsFake((query: string, callback: any) => {
      results.push(query);
      return callback("pw");
    }),
    close: sinon.stub(),
  };

  readlineStub = sinon
    .stub(readline, "createInterface")
    .returns(readlineInterfaceStub);

  await getStoreCredentials();
  t.true(results[0] === "What is the password for the store? ");
  t.true(results[1] === loadedConfiguration.prompts.databaseConnectionString);
  t.true(results[2] === loadedConfiguration.prompts.sshString);
});

// todo: test("Does not prompt the user for values which are already present", async (t) => {});

test.serial("Writes to a store file", async (t) => {
  const readlineInterfaceStub = {
    question: sinon.stub().callsFake((query: string, callback: any) => {
      if (query.indexOf("database") >= 0) return callback("test_db");
      else if (query.indexOf("SSH") >= 0) return callback("test_ssh");
      else return callback("pw");
    }),
    close: sinon.stub(),
  };

  readlineStub = sinon
    .stub(readline, "createInterface")
    .returns(readlineInterfaceStub);

  // testing to see if dashboar-store exists
  await getStoreCredentials();
  t.true(fs.existsSync(storeFilePath));

  // testing to see if the store values are properly stored
  const buffer = fs.readFileSync(storeFilePath);
  const data: Store = JSON.parse(buffer.toString());
  t.is(data.databaseConnectionString, "test_db");
  t.is(data.sshString, "test_ssh");
});

/* todo:
test(“Reads from a store file with the correct password”, () => {})
test(“Cannot read from the store file with an incorrect password”, () => {})
*/
