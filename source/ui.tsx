import React from 'react';
import Branch from "./boards/branch";
import { join } from 'path'

const config: {commands: string[]} = require(join(process.cwd(), './dashboar-config'));

const DashBoards = () => {
	return <>
		{
			config.commands.map(command => <Branch key={command} command={command}/> )

		}
	</>
};


module.exports = DashBoards;
export default DashBoards;
