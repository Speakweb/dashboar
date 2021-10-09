import React from 'react';
import Branch from "./boards/branch";

const DashBoards = () => {
	return <>
		<Branch command={'ls'}/>
		<Branch command={'git status'}/>
	</>
};


module.exports = DashBoards;
export default DashBoards;
