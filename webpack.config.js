const path = require('path');

module.exports = {
  entry: './src/main.ts',
  mode : 'development',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'lib'),
  },
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test:/node_modules[\\|/](yaml-language-server|vscode-languageserver|vscode-json-languageservice|prettier)/,
            use: 'umd-compat-loader'
        }
    ]
},
target: 'node',
resolve: {
    extensions: ['.tsx', '.ts', '.js']
}
}


