import React, {useEffect, useState} from "react";
import {Text} from "ink";
import { exec } from 'child_process';

const TEN_SECONDS = 10000;
const RepeatCommand = ({command}: {command: string}) => {
	const [color, setColor] = useState('green');
	const [output, setOutput] = useState('');
	useEffect(() => {
		const timer = setInterval(() => {
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
		}, TEN_SECONDS);

		return () => {
			clearInterval(timer);
		};
	}, []);

	// Command output usually ends in a newLine, so trim it.
	return <Text color={color}>{output.trim()}</Text>;
}
export default RepeatCommand
