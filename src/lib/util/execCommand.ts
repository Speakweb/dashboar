import {exec} from "child_process";

export const execCommand = (command: string, setOutput: (value: (((prevState: string) => string) | string)) => void, setColor: (value: (((prevState: string) => string) | string)) => void) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            setOutput(error.message)
            setColor('red')
            return;
        }
        if (stderr) {
            setOutput(stderr)
            setColor('red')
            return;
        }
        setOutput(stdout)
        setColor('green')
    })
};
