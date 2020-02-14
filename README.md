# Validate YAML Schema

This action validates YAML files using the `yaml.schemas` settings for the [VS Code YAML Extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

> NOTE: This doesn't actually work yet

## Inputs

No inputs needed, the schema mappings will be read from the **.vscode/settings.json** file

## Outputs

### `validationResults`

The time we greeted you.

## Example usage

    uses: nwisbeta/validate-yaml-schema@v1

## Thanks

Some code taken and 'remixed' from 
 - https://github.com/OrRosenblatt/validate-json-action 
 - https://github.com/redhat-developer/yaml-language-server
