import * as URL from 'url';
import { TextDocument } from 'vscode-languageserver';
import { getLanguageService, LanguageSettings, LanguageService, SchemaRequestService } from 'yaml-language-server'
import { schemaRequestHandler } from './services/schemaRequestHandler'

export class SchemaValidator { 

  constructor(schemaSettings : any, workspaceRoot : string) {
    this.addSchemaSettings(schemaSettings);     
    this.getLanguageService(workspaceRoot);
  }

  private languageService : LanguageService;

  private languageSettings : LanguageSettings = {
    validate: true, // Turn on validation, turn off everything else
    hover: false,
    completion: false,
    format: false,
    isKubernetes: false,
    schemas: [],
    customTags: []
  };

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

  private getLanguageService(workspaceRoot : string){

    // Request Service: Fetches file content from given location
    const requestService = schemaRequestHandler.bind(null, workspaceRoot);
    
    // Context Service: Resolves relative file locations (not sure why it's needed as request service handles that too...)
    const contextService = {
      resolveRelativePath: (relativePath: string, resource: string) => 
        URL.resolve(resource, relativePath)  
    };

    const languageService = getLanguageService(
      requestService,
      contextService,
      [],
      null
    );
    languageService.configure(this.languageSettings);

    this.languageService = languageService;
  }


  public async isValid(yamlDocument : TextDocument) : Promise<boolean> {

    const results = await this.languageService.doValidation(yamlDocument, false);

    if (results.length) {
      console.log(yamlDocument.uri);
      console.log(JSON.stringify(results));
      return false;
    }
      
    return true;
  }

};