import test from "ava";
const sinon = require("sinon");
import { getStoreCredentials } from "./get-store-credentials";
import fs from "fs";
import readline from "readline";
import { join } from "path";
import { StoreConfig } from "./config";
import { decrypt } from "./encrypt-decrypt";

const loadedConfiguration: StoreConfig = require(join(
  process.cwd(),
  "./dashboar.config.epub-finder.js"
));
const storeFilePath = "dashboar-store";
let readlineStub: any;

test.beforeEach(() => {
  if (fs.existsSync(storeFilePath)) fs.unlinkSync(storeFilePath);
  const readlineInterfaceStub = {
    question: sinon.stub().callsFake((query: string, callback: any) => {
      if (query.indexOf("database") >= 0) return callback("test_db");
      else if (query.indexOf("SSH") >= 0) return callback("test_ssh");
      else return callback("test_pw");
    }),
    close: sinon.stub(),
  };
  readlineStub = sinon.stub(readline, "createInterface").returns(readlineInterfaceStub);
})

test.afterEach(() => {
  if (fs.existsSync(storeFilePath)) fs.unlinkSync(storeFilePath);
  if (readlineStub) readlineStub.restore();
});

test.serial("Prompts the user for values if the store is empty", async (t) => {
  if (readlineStub) readlineStub.restore();
  let results: any = [];

  const readlineInterfaceStub = {
    question: sinon.stub().callsFake((query: string, callback: any) => {
      results.push(query);
      return callback("test_pw");
    }),
    close: sinon.stub(),
  };
  readlineStub = sinon.stub(readline, "createInterface").returns(readlineInterfaceStub);

  await getStoreCredentials();
  t.true(results[0] === "What is the password for the store? ");
  t.true(results[1] === loadedConfiguration.prompts.databaseConnectionString);
  t.true(results[2] === loadedConfiguration.prompts.sshString);

});

test.serial("Writes to a store file", async (t) => {
  // testing to see if dashboar-store exists
  await getStoreCredentials();
  t.true(fs.existsSync(storeFilePath));

  // testing to see if the store values are properly stored
  const buffer = fs.readFileSync(storeFilePath);
  const encryptedData = buffer.toString().replace(/['"]+/g, "");
  const decryptedData = decrypt('test_pw', encryptedData);
  const data = decryptedData !== null ? JSON.parse(decryptedData) : {};
  t.is(data.databaseConnectionString, "test_db");
  t.is(data.sshString, "test_ssh");
});

test.serial("Cannot read from the store file with an incorrect password", async (t) => {
  // initially creating dashboar-store with test password
  await getStoreCredentials();
  if (readlineStub) readlineStub.restore();

  // creating new mock implementation for when dashboar-store already exists
  const readlineInterfaceStub2 = {
    question: sinon.stub().callsFake((query: string, callback: any) => {
      if (query) callback("incorrect_pw");
    }),
    close: sinon.stub(),
  };
  readlineStub = sinon.stub(readline, "createInterface").returns(readlineInterfaceStub2);
  const consoleLogSpy = sinon.spy(console, 'log');
  
  await getStoreCredentials();
  t.true(consoleLogSpy.calledWith('Incorrect Password'));
  consoleLogSpy.restore();
});

/*
test.serial("Reads from a store file with the correct password", async (t) => {
  // initially creating dashboar-store with test password
  await getStoreCredentials();
  if (readlineStub) readlineStub.restore();

  // creating new mock implementation for when dashboar-store already exists
  const readlineInterfaceStub2 = {
    question: sinon.stub().callsFake((query: string, callback: any) => {
      if (query) callback("test_pw");
    }),
    close: sinon.stub(),
  };
  readlineStub = sinon.stub(readline, "createInterface").returns(readlineInterfaceStub2);
  
  await getStoreCredentials();
  
});
*/

// todo: test.serial("Does not prompt the user for values which are already present", async (t) => {});