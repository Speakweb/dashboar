import {PostgresqlConnectionConfig} from "../config";
import {PostgresConnection} from "../../components/PostgresConnection";
import React from "react";
import {DashboarPanel} from "./DashboarPanel";

export class PostgresqlConnectionPanel extends DashboarPanel<PostgresqlConnectionConfig> {
    errorMessage(): string | undefined {
        const requiredKeys = ['user', 'host', 'database', 'password', 'port'];
        const missingKeys = requiredKeys.filter(key => !this.storeEntry[key]);
        if (missingKeys.length) {
            return `Please set the following environment variable values ${this.configEntry.configKey} to monitor this postgres connection ${missingKeys.join(',')}`
        }
        return;
    }

    pane() {
        const configValues = this.storeEntry as unknown as {
            host: string;
            user: string;
            database: string;
            password: string;
            port: number;
        };
        return <PostgresConnection
            key={this.configEntry.configKey}
            {...configValues}
        />;
    }
}
