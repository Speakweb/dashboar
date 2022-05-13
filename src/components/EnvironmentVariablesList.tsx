import { Text } from "ink";
import React from "react";

export const EnvironmentVariablesList: React.FC<{ envVarList: [string] }> = ({envVarList}) => {
  return (
    <>
      {envVarList.map((envVar) => (
        <Text>{envVar + '=' + process.env[envVar]}</Text>
      ))}
    </>
  );
};
