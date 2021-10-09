import React, {useEffect, useState} from "react";
import {Text} from "ink";
import { exec } from 'child_process';

const Branch = ({command}: {command: string}) => {
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
		}, 100);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return <Text color={color}>{output}</Text>;
}
export default Branch