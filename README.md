# Validate YAML Schema

This action validates YAML files using the `yaml.schemas` settings for the [VS Code YAML Extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

> NOTE: This doesn't actually work yet

## Inputs

No inputs needed, the schema mappings will be read from the **.vscode/settings.json** file

## Outputs

### `invalidFiles`

A comma separated list of files that failed the schema validation

## Example usage

    uses: nwisbeta/validate-yaml-schema@v0.1-alpha

## Thanks

Some code taken and 'remixed' from 
 - https://github.com/OrRosenblatt/validate-json-action 
 - https://github.com/redhat-developer/yaml-language-server
