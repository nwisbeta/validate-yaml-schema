import * as URL from 'url';
import {  TextDocument } from 'vscode-languageserver';
import { getLanguageService, LanguageSettings } from 'yaml-language-server'

// Set up Language Settings

// Turn on validation
const languageSettings: LanguageSettings = {
    validate: true,
    hover: false,
    completion: false,
    format: false,
    isKubernetes: false,
    schemas: [],
    customTags: []
};
// Set up schema matching rules
//TODO: Fetch this from a settings
const schemaUri = 'http://json.schemastore.org/package';
const globsFileMatch = ['*.yml', '*.yaml'];
languageSettings.schemas.push({ uri: schemaUri, fileMatch: globsFileMatch });

// Set up Language Servce

// Create a Context Service: Resolves relative file locations
let contextService = {
    resolveRelativePath: (relativePath: string, resource: string) => {
        console.log(`resource:${resource} , relativePath: ${relativePath}`)
        return URL.resolve(resource, relativePath)
    } 
};
// Create a Request Service: Fetches file content from given location
let requestService = (uri: string): Thenable<string> => {

    return new Promise<string>((resolve,reject) => {resolve(`
    {
      "definitions": {},
      "$schema": "http://json-schema.org/draft-07/schema#",
      "$id": "http://example.com/example.json",
      "type": "object",
      "title": "Example schema",
      "required": [
        "prop1",
        "prop2"
      ],
      "properties": {
        "prop1": {
          "$id": "#/properties/prop1",
          "type": "string",
          "title": "The Prop1 Schema",
          "default": "",
          "examples": [
            ""
          ],
          "pattern": "^(.*)$"
        },
        "prop2": {
          "$id": "#/properties/prop2",
          "type": "string",
          "title": "The Prop2 Schema",
          "default": "",
          "examples": [
            ""
          ],
          "pattern": "^(.*)$"
        }
      }
    }`);})
};
// Create the language Service
const languageService = getLanguageService(
    requestService,
    contextService,
    [],
    null
);
// Configure with the settings
languageService.configure(languageSettings);



// Get the document
const documentContent = 'prop1: test\nprop2: test1';
const documentUri = 'file://~/Desktop/my-document.yaml';
const testTextDocument = TextDocument.create(
    documentUri,
    'yaml',
    0,
    documentContent
);

//Do the validation
languageService.doValidation(testTextDocument, false).then(function (result) {
   console.log(JSON.stringify(result));
});





