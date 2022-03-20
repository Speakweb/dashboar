const readline = require('readline');
const fs = require('fs');
//import {join} from "path";
//import {StoreConfig} from './source/lib/config';

//const loadedConfiguration: StoreConfig = require(join(process.cwd(), './dashboar.config.epub-finder'));

type Store = {
  databaseConnectionString: string,
  sshString: string
};

const storeFilePath = 'dashboar-store';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const query = async () => {
  if (fs.existsSync(storeFilePath)) {
    const buffer = fs.readFileSync(storeFilePath);
    const data: Store = JSON.parse(buffer.toString());
    // todo: check if values from config file are present in store file
  } else {
    console.log("\nCould not find input file, creating one: ./dashboar-store");
  
    const values: Store = {
      databaseConnectionString: '',
      sshString: '',
    };
    
    rl.question('What is the password for the store? ', (pw: string) => {
      // todo: encrypt file with pw
      console.log('Created dashboar-store');
      
      rl.question('What is the database connection string? ', (dbString: string) => {
          values.databaseConnectionString = dbString;
          console.log('Wrote databaseConnectionString to store');
          
          rl.question('What is the ssh string? ', (sshString: string) => {
              values.sshString = sshString;
              console.log('Wrote sshString to store');
  
              fs.writeFileSync(storeFilePath, JSON.stringify(values));
              rl.close();
          });
      });
    });
  };
}

query();