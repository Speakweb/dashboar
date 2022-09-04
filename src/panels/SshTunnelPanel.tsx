import {SshTunnelConfig} from "../lib/config";
import React from "react";
import {DashboarPanel} from "./DashboarPanel";
import { SshTunnel, SshTunnelProps } from "../components/SshTunnel";

export class SshTunnelPanel extends DashboarPanel<SshTunnelConfig> {

    errorMessage() {
        return undefined;
    }

    pane() {
        // TODO replace this with a real ssh tunnel instead of just running a command
        return <SshTunnel
            key={this.configEntry.configKey}
			{...this.storeEntry as SshTunnelProps}
        />
    }
}
