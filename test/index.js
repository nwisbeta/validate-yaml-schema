const uri = require('vscode-uri').URI;

const path = require('path');

console.log(Object.getOwnPropertyNames(uri));


let f = uri.parse('/c/foo/bar/');

console.log(JSON.stringify(f));

console.log(JSON.stringify(f.fsPath));

var p = path.join('C://home/user/huw', '.vscode/settings.json');

console.log(p);