import * as core from '@actions/core';
import { validateYaml } from './yaml-validator';

async function run() {
  try {

    const workspaceRoot = <string>process.env['GITHUB_WORKSPACE'];
   

    const validationResults = await validateYaml(workspaceRoot);

    const invalidResults = validationResults.filter(res => !res.valid).map(res => res.filePath);

    const invalidFiles = invalidResults.length > 0 ? invalidResults.join(',') : '';

    core.setOutput('invalidFiles', invalidFiles);

    if (invalidResults.length > 0) {
        core.warning('Invalid Files: ' + invalidFiles);
        core.setFailed('Schema validation failed on one or more YAML files.');
    } else {
        core.info(`✅ YAML Schema validation completed successfully`);
    }

  } catch (error) {
    core.setFailed(error.message);
  }

}

run();