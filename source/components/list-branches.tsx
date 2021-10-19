import React, {useEffect, useState} from "react";
import {Text} from "ink";
import { exec } from 'child_process';

function executeCommand(command: string, setOutput: (s: string[]) => unknown, setColor: (s: string) => unknown) {
	exec(command, (error, stdout, stderr) => {
		if (error) {
			setOutput(error.message.split('\n'))
			setColor('red')
			return;
		}
		if (stderr) {
			setOutput(stderr.split('\n'))
			setColor('red')
			return;
		}
		setOutput(stdout.split('\n'))
		setColor('green')
	})
}

const ListBranch = ({command}: {command: string}) => {
	const [color, setColor] = useState('green');
	const [output, setOutput] = useState<string[]>([]);
	useEffect(() => {
		executeCommand(command, setOutput, setColor);
		const timer = setInterval(() => {
			executeCommand(command, setOutput, setColor);
		}, 100);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return output.map(outputLine => <Text color={color}>{outputLine} </Text>)
}
export default ListBranch
