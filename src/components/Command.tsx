import React, {useEffect, useState} from "react";
import {Text} from "ink";
import {execCommand} from "../lib/execCommand";

export const TEN_SECONDS = 10000;
export const Command = ({command}: {command: string}) => {
	const [color, setColor] = useState('green');
	const [output, setOutput] = useState('');
	useEffect(() => {
		execCommand(command, setOutput, setColor);
	}, []);
	return <Text color={color}>{output.trim()}</Text>;
}

