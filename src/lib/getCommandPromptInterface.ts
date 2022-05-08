import readline from "readline";

/**
 * I wonder if this should be a global
 * I think it should be, because it has to be closed later
 */
export const getCommandPromptInterface = () => readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
