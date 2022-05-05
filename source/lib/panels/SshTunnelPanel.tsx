import {SshTunnelConfig} from "../config";
import {Command} from "../../Command.tsx/Command";
import React from "react";
import {DashboarPanel} from "./DashboarPanel";

export class SshTunnelPanel extends DashboarPanel<SshTunnelConfig> {
    private resolveCommand() {
        return typeof this.configEntry.command === 'string' ?
            this.configEntry.command : this.configEntry.command(this.storeEntry || {})
    }

    errorMessage() {
        const hasCommand = Boolean(this.resolveCommand());

        if (!hasCommand) {
            return `A user provided input tunnel command for ${this.configEntry.configKey} is required`
        }

        return;
    }

    pane() {
        // TODO replace this with a real ssh tunnel instead of just running a command
        const command = this.resolveCommand();
        return <Command
            key={command}
            command={command}
        />
    }
}
