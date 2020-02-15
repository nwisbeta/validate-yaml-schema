import * as core from '@actions/core';
import { validateYaml } from './yaml-validator';

async function run() {
  try {

    const workspaceRoot = <string>process.env['GITHUB_WORKSPACE'];
   

    const validationResults = await validateYaml(workspaceRoot);

    const invalidResults = validationResults.filter(res => !res.valid).map(res => res.filePath);

    core.setOutput('INVALID', invalidResults.length > 0 ? invalidResults.join(',') : '');

    if (invalidResults.length > 0) {
        core.setFailed('Failed to validate all YAML files.');
    } else {
        core.info(`✅ All files were validated succesfully.`);
    }

  } catch (error) {
    core.setFailed(error.message);
  }

}

run();