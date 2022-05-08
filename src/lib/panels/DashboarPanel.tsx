import {StoreValueType} from "../config";
import React, {ReactElement} from "react";
import {Box, Text} from "ink";

export abstract class DashboarPanel<T> {
	protected configEntry: T;
	protected storeEntry: Record<string, string | number>;

	constructor({configEntry, storeEntry}:{configEntry: T, storeEntry: Record<string, StoreValueType>}) {
		this.configEntry = configEntry;
		this.storeEntry = storeEntry;
	}
	Component({key}:{key?: string | number}) {
		const errorMessage = this.errorMessage();
		if (errorMessage) {
			return <Box
				key={key}
				borderStyle="single"
				flexDirection='column'
			>
				<Text>{errorMessage}</Text>
			</Box>;
		}
		return <Box
			borderStyle="single"
			flexDirection='column'
			key={key}
		>{this.pane()}</Box>;
	}

	/**
	 * The panel pane if the config is valid
	 */
	abstract pane(): ReactElement
	/**
	 * If we can't find a value from any src, output the error messages
	 */
	abstract errorMessage(): string | undefined

}
