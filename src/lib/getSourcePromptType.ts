import {SourcePromptSchema, SourceSchema} from "./config";

export const getSourcePromptType = (sourceSchema: SourceSchema) => ({
    sourceIsPromptString: typeof sourceSchema === 'string',
    sourceIsPromptFunction: typeof sourceSchema === 'function',
    sourceIsPromptObject: Boolean((sourceSchema as SourcePromptSchema).prompt)
});
