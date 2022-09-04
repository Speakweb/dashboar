import {StoreValueType} from "../lib/config/config";
import React, {ReactElement} from "react";
import {Box, Text} from "ink";

export abstract class DashboarPanel<T, StoreValues = Record<string, StoreValueType>> {
	protected configEntry: T;
	protected storeEntry: StoreValues;

	constructor({configEntry, storeEntry}:{configEntry: T, storeEntry: StoreValues}) {
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
