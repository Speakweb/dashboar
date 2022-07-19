import React, {useEffect, useState} from "react";
import {Text} from "ink";

export const JavascriptFunction = ({ func, configKey }: {func: () => string | Promise<string>, configKey: string}) => {
	const [color, setColor] = useState('green');
	const [output, setOutput] = useState('');
	useEffect(() => {
		(async () => {
			try {
				setOutput(await func())
			} catch(e) {
				setColor('red')
				setOutput(`Error executing function ${configKey}`);
			}
		})();
	}, []);
	return <Text color={color}>{output.trim()}</Text>;
}

