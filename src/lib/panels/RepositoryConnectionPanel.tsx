import {RepositoryConfig} from "../config";
import React from "react";
import {DashboarPanel} from "./DashboarPanel";
import {Text} from "ink";

export class RepositoryConnectionPanel extends DashboarPanel<RepositoryConfig> {
	errorMessage(): string | undefined {
		// return "Your mother";
		return undefined;
	}

	pane() {
		const configValues = this.configEntry as unknown as { url: string[]; };
		return <RepositoryConnection
			key={this.configEntry.configKey}
			{...configValues}
		/>;
	}
}


const RepositoryConnection = ({url}: { url: string[] }) => {

	// TODO finish this
	return <Text>{url}</Text>
}
