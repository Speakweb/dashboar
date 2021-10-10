import React, {useEffect, useState} from "react";
import {Text} from "ink";
import { exec } from 'child_process';

const List_Branch = ({command}: {command: string}) => {
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

	return output.map(outputLine => <Text color={color}>{outputLine}</Text>);
}
export default List_Branch
