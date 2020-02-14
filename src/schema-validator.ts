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
    const requestService = schemaRequestHandler.bind(workspaceRoot);
    
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


  public doValidation(yamlDocument : TextDocument) : boolean {

    this.languageService.doValidation(yamlDocument, false).then(function (result) {
      console.log(JSON.stringify(result));
    });
    return true; //TODO: figure out when to throw an error
  }

};