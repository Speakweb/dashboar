import React, {useEffect, useState} from "react";
import {Text} from "ink";
import {execCommand} from "../lib/execCommand";

const TEN_SECONDS = 10000;
export const RepeatCommand = ({command}: {command: string}) => {
	const [color, setColor] = useState('green');
	const [output, setOutput] = useState('');
	useEffect(() => {
		const timer = setInterval(() => {
			execCommand(command, setOutput, setColor);
		}, TEN_SECONDS);

		return () => {
			clearInterval(timer);
		};
	}, []);

	// Command output usually ends in a newLine, so trim it.
	return <Text color={color}>{output.trim()}</Text>;
}
export default RepeatCommand
