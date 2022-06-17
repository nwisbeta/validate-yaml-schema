> **DEPRECATION NOTICE**: This action has been removed from the GitHub marketplace and will receive no further updates.  
> If you'd like fork the code and publish it yourself, you're free to do so under the [Creative Commons License](https://github.com/nwisbeta/validate-yaml-schema/blob/master/LICENSE.md)

# Validate YAML Schema

This action validates YAML files using the `yaml.schemas` settings for the [VS Code YAML Extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

All you need is a **.vscode/settings.json** document at the root of the repository that contains the `yaml.schemas` setting

## Inputs

### `settingsFile` (optional)

Location of the schema configuration file.

The default location is **.vscode/settings.json**, you can change it do a different location but it but still be a json document containing the `yaml.schemas` config.
See the [VS Code YAML Extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) for how to structure the config.


### `yamlSchemasJson` (optional)

The yaml.schemas config as inline JSON

Instead of adding the `yaml.schemas` config to a file, you can instead supply it as inline JSON, e.g.:

```yaml
      - uses: nwisbeta/validate-yaml-schema@v1.0.3
        with:
          yamlSchemasJson: |
            {
                "http://json.schemastore.org/composer": ["/*"],
                "file:///home/johnd/some-schema.json": ["some.yaml"],
                "../relative/path/schema.json": ["/config*.yaml"],
                "/Users/johnd/some-schema.json": ["some.yaml"],
            }
```


## Outputs

### `validFiles`

A comma separated list of files that passed the schema validation.

### `invalidFiles`

A comma separated list of files that failed the schema validation.

 > Schema validation fails if any results are returned from the YAML Language Server

## Example usage
 You'll need to precede the action with `actions/checkout@v2` as this action will read files from the [GITHUB_WORKSPACE directory](https://help.github.com/en/actions/configuring-and-managing-workflows/using-environment-variables)

    steps:
      - uses: actions/checkout@v2
      - uses: nwisbeta/validate-yaml-schema@v1.0.3

## Thanks
This action has been made by 're-mixing' logic from these repos:
 - https://github.com/OrRosenblatt/validate-json-action
 - https://github.com/redhat-developer/yaml-language-server
