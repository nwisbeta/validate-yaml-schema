import * as core from '@actions/core';
import * as github from '@actions/github';

//ref: https://help.github.com/en/actions/building-actions/creating-a-javascript-action
try {

  const validationResults = [];
  core.setOutput("validationResults", JSON.stringify(validationResults));
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}