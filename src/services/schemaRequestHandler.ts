import { URI } from 'vscode-uri';
import { xhr, XHRResponse, getErrorStatusDescription } from 'request-light';
import * as fs from 'fs';
import { join } from 'path';


const isRelativePath = (path: string): boolean => {
    const relativePathRegex = /^(((\.\.?)|([\w-\. ]+))(\/|\\\\?))*[\w-\. ]*\.[\w-]+$/i;
    return relativePathRegex.test(path);
};

/**
 * Handles schema content requests given the schema URI
 * @param uri can be a local file or http(s) request
 */
export const schemaRequestHandler = (workspaceRoot: string, uri: string): Thenable<string> => {
    if (!uri) {
        return Promise.reject('No schema specified');
    }

    // If the requested schema URI is a relative file path
    // Convert it into a proper absolute path URI
    if (isRelativePath(uri)) {
        uri = join(workspaceRoot, uri);
    }

    const scheme = URI.parse(uri).scheme.toLowerCase();

    // If the requested schema is a local file, read and return the file contents
    if (scheme === 'file') {
        const fsPath = URI.parse(uri).fsPath;

        return new Promise<string>((c, e) => {
            fs.readFile(fsPath, 'UTF-8', (err, result) =>
                // If there was an error reading the file, return empty error message
                // Otherwise return the file contents as a string
                err ? e('') : c(result.toString())
            );
        });
    }

    // HTTP(S) requests are sent and the response result is either the schema content or an error
    if (scheme === 'http' || scheme === 'https') {

        // Send the HTTP(S) schema content request and return the result
        const headers = { 'Accept-Encoding': 'gzip, deflate' };
        return xhr({ url: uri, followRedirects: 5, headers })
               .then(response => response.responseText,
                    (error: XHRResponse) => Promise.reject(error.responseText || getErrorStatusDescription(error.status) || error.toString()));
    }

    // Neither local file nor HTTP(S) schema request
    return Promise.reject('unsupported schema uri');
};