import {DashboarPanel} from "./DashboarPanel";
import {GitSyncRemotesConfig} from "../lib/config/config";
import {GitSyncRemotes} from "../components/GitSyncRemotes";
import React from "react";

export type GitSyncRemotesStoreParams = { baseDir: string, sourceRemote: string, destRemote: string, branch: string };

export class GitSyncRemotesPanel extends DashboarPanel<GitSyncRemotesConfig, GitSyncRemotesStoreParams> {
	errorMessage(): string | undefined {
		// TODO check if urls property exists before starting
		return undefined;
	}

	 pane() {
		return <GitSyncRemotes {...this.storeEntry}/>
	}
}
