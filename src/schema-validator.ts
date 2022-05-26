import * as URL from 'url';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { LanguageSettings } from 'yaml-language-server'
import { YAMLValidation } from 'yaml-language-server/lib/umd/languageservice/services/yamlValidation'
import { YamlVersion } from 'yaml-language-server/lib/umd/languageservice/parser/yamlParser07'
import { YAMLSchemaService } from 'yaml-language-server/lib/umd/languageservice/services/yamlSchemaService'
import { schemaRequestHandler } from './services/schemaRequestHandler'

export class SchemaValidator { 

  constructor(schemaSettings : any, workspaceRoot : string, yamlVersion: string) {
    this.addSchemaSettings(schemaSettings);     
    this.setYamlVersion(yamlVersion)
    this.buildValidator(workspaceRoot);
  }

  private validator : YAMLValidation;

  private languageSettings : LanguageSettings = {
    validate: true, // Turn on validation, turn off everything else
    hover: false,
    completion: false,
    format: false,
    isKubernetes: false,
    schemas: [],
    customTags: []
  };

  private setYamlVersion(version: string) {
    const yamlVersion = version? <YamlVersion>(version) : <YamlVersion>"1.2";
    this.languageSettings.yamlVersion = yamlVersion;
  }

  private addSchemaSettings(schemaSettings) {
  
    for (const uri in schemaSettings) {
        const globPattern = schemaSettings[uri];
  
        const schemaObj = {
            'fileMatch': Array.isArray(globPattern) ? globPattern : [globPattern],
            'uri': uri
        };
        this.languageSettings.schemas.push(schemaObj);
    }
  }

  private buildValidator(workspaceRoot : string){

    // Request Service: Fetches file content from given location
    const requestService = schemaRequestHandler.bind(null, workspaceRoot);
    
    // Context Service: Resolves relative file locations (not sure why it's needed as request service handles that too...)
    const contextService = {
      resolveRelativePath: (relativePath: string, resource: string) => 
        URL.resolve(resource, relativePath)  
    };

    /////////////////////////////////////////////////////////////////////
    // "borrowed" from https://github.com/redhat-developer/yaml-language-server/blob/4a36b9b26f4b0322128d7db1afb1d25f21c8cbea/src/languageservice/yamlLanguageService.ts#L189

    const yamlSchemaService = new YAMLSchemaService(requestService, contextService);
    const yamlValidation = new YAMLValidation(yamlSchemaService);
    const settings = this.languageSettings;

    yamlSchemaService.clearExternalSchemas();
      if (settings.schemas) {
        yamlSchemaService.schemaPriorityMapping = new Map();
        settings.schemas.forEach((settings) => {
          const currPriority = settings.priority ? settings.priority : 0;
          yamlSchemaService.addSchemaPriority(settings.uri, currPriority);
          yamlSchemaService.registerExternalSchema(
            settings.uri,
            settings.fileMatch,
            settings.schema,
            settings.name,
            settings.description
          );
        });
      }
      yamlValidation.configure(settings);
      /////////////////////////////////////////////////////////////////////

    this.validator = yamlValidation;
  }


  public async isValid(yamlDocument : TextDocument) : Promise<boolean> {

    const results = await this.validator.doValidation(yamlDocument, false);

    if (results.length) {
      console.log(yamlDocument.uri);
      console.log(JSON.stringify(results));
      return false;
    }
      
    return true;
  }

};