import React from "react";
import { Box } from "ink";
import { EnvironmentVariablesList } from "../../components/EnvironmentVariablesList";

export class EnvironmentVariablesPanel {
  protected envVarList: string[];

  constructor(envVarList: string[]) {
    this.envVarList = envVarList;
  }

  Component({ key }: { key?: string | number }) {
    return (
      <Box borderStyle="single" flexDirection="column" key={key}>
        <EnvironmentVariablesList envVarList={this.envVarList} />
      </Box>
    );
  }
}
