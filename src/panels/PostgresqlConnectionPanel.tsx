import {PostgresqlConnectionConfig} from "../lib/config/config";
import {PostgresConnection} from "../components/PostgresConnection";
import React from "react";
import {DashboarPanel} from "./DashboarPanel";

export type PostgresConnectionParameters = {
	host: string;
	user: string;
	database: string;
	password: string;
	port: number;
};

export class PostgresqlConnectionPanel extends DashboarPanel<PostgresqlConnectionConfig, PostgresConnectionParameters> {
    errorMessage(): string | undefined {
        const requiredKeys = ['user', 'host', 'database', 'password', 'port'] as (keyof PostgresConnectionParameters)[];
        const missingKeys = requiredKeys.filter(key => !this.storeEntry[key]);
        if (missingKeys.length) {
            return `Please set the following environment variable values ${this.configEntry.configKey} to monitor this postgres connection ${missingKeys.join(',')}`
        }
        return;
    }

    pane() {
        const configValues = this.storeEntry;
        return <PostgresConnection
            key={this.configEntry.configKey}
            {...configValues}
        />;
    }
}
