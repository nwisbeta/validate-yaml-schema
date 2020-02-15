import * as path from 'path';
import { TextDocument } from 'vscode-languageserver';
import { getYaml, getJson } from './yaml-file-reader';
import { SchemaValidator } from './schema-validator';
import { prettyLog } from './logger';

export interface ValidationResult {
    filePath: string;
    valid: boolean;
}

export const validateYaml = async ( workspaceRoot: string): Promise<ValidationResult[]> => {

    try {
        //Get the schema settings
        const settings  = await getJson(path.join(workspaceRoot, '.vscode/settings.json'));
        const schemas = settings ? settings['yaml.schemas'] : null;

        if(!schemas)
            throw 'no schema settings found';

        const schemaValidator = new SchemaValidator(schemas, workspaceRoot);


        //TODO: loop through all yaml files and request validation
        const filePaths : string[] = ['/catalogue/ac3/system.yml'];      
    
        return await Promise.all(
            filePaths.map(async filePath => {
                try {
                    const yamlDocument = await getYaml(path.join(workspaceRoot,filePath));
                    const result = await schemaValidator.doValidation(yamlDocument);
                    prettyLog(filePath);
                    return { filePath, valid: result };
                } catch (e) {
                    prettyLog(filePath, e);
                    return { filePath, valid: false };
                }
            })
        );
    } catch (err) {
        prettyLog(workspaceRoot, err);
        return [{ filePath: workspaceRoot, valid: false }];
    }
};


