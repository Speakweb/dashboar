import {createInterface} from "readline";
import { exec } from "child_process";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const commands = {
  start: "Starts the program",
  test: "runs ava tests",
  "start --set someKey=someValue": 'Sets "someKey" as "someValue" in dashboar-store',
  "start --get someConfigKey": 'Gets "SomeConfigKey" from the config file. Running "npm start --get *" will display all config values',
  help: "Displays a help menu that lists all the commands",
};

const between = (x: number, min: number, max: number) => {
  return x >= min && x <= max;
};

const helpMenu = () => {
  const formatPrompt = (commands: any) => {
    let prompt = "List of commands:\n";
    Object.keys(commands).forEach((command: string, idx: number) => {
      prompt += `${idx + 1}) ${command}   ---->   ${commands[command]}\n`;
    });
    return prompt;
  };

  const getInput = () => {
    rl.question("Enter the number of the command you would like to execute: ", (answer: string) => {
      const keys = Object.keys(commands);
      if (Number.isNaN(Number(answer)) || !between(Number(answer), 1, keys.length)) {
        console.log("Invalid command number");
        getInput();
      } else {
        rl.close();
        const cmd = exec(`npm run ${keys[Number(answer) - 1]}`);
        // @ts-ignore
        process.stdin.pipe(cmd.stdin);
        cmd?.stdout?.pipe(process.stdout);
      }
    });
  };

  console.log(formatPrompt(commands));
  getInput();
};

helpMenu();
