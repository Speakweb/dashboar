/**
 * Make a components which takes as input a command, gets the output of that command and displays it in a listt stat
 */


import React, {useEffect, useState} from "react";
import {Text} from "ink";
import { exec } from 'child_process';

const Branch = ({command}: {command: string}) => {
	const [color, setColor] = useState('green');
	const [output, setOutput] = useState<string[]>([]);

	useEffect(() => {
		const timer = setInterval(() => {
			exec(command, (error, stdout, stderr) => {
				if (error) {
					setOutput(error.message.split("\n"))
					setColor('red')
					return;
				}
				if (stderr) {
					setOutput(stderr.split("\n"))
					setColor('red')
					return;
				}
				setOutput(stdout.split("\n"))
				setColor('green')
			})
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <Text color={color}>{output}</Text>;
}
export default Branch
