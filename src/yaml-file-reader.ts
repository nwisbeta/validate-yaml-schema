import * as fs from 'fs';
import { TextDocument } from 'vscode-languageserver';
import { InvalidJsonFileError } from './errors';

export const getYaml = async (filePath: string): Promise<TextDocument> => {
    //TODO: return a real document
    return TextDocument.create(
        'file://~/Desktop/my-document.yaml',
        'yaml',
        0,
        'prop1: test\nprop2: test1'
      );
};


export const getJson = async (filePath: string): Promise<any> => {
    try {
        const fileContents = await fs.promises.readFile(filePath, { encoding: 'utf-8' });
        const json = JSON.parse(fileContents);
        return json;
    } catch (ex) {
        throw new InvalidJsonFileError(filePath, ex);
    }
};