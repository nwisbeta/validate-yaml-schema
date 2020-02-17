import * as path from 'path';
import { glob } from 'glob'
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


        //TODO: improve this implementation - e.g. use the glob patterns from the yaml.schemas settings        
        const filePaths = await new Promise<string[]>((c,e) => {
            glob(
                '**/*.yml', 
                {
                    cwd : workspaceRoot,
                    silent : true,
                    nodir : true,
                },
                (err, files) => { 
                    if (err) {
                        e(err)
                    }                      
                    c(files);
                });
        });
    
        return await Promise.all(
            filePaths.map(async filePath => {
                try {
                    const yamlDocument = await getYaml(path.join(workspaceRoot,filePath));
                    const result = await schemaValidator.isValid(yamlDocument);
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


