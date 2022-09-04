// Prompts the user for values based off the questions in the config file
import {Interface} from "readline";

export const promptUserForValue = async ({cli, prompt, valueType}: { cli: Interface, prompt: string | (() => string) , valueType: "string" | "number" | undefined}) => {
    // Call this until the answer is not blank.
    // TODO: Add ways for the user to cancel/skip this value
    const askForValue = () => new Promise<string>((resolve) => {
        cli.question((typeof prompt === 'string') ? prompt : prompt(), async (answer: string) => {
            // TODO add logic for number/string prompts too
            resolve(answer);
        });
    });
    let value: string = "";
    while (!value) {
        value = await askForValue();
        if (!value) {
            console.log("Value not provided");
        }
		if (valueType === "number" && !Number.isNaN(Number(value))) {
			console.log("Value must be of type Number");
			value = "";
		}
    }
    return value;
};
