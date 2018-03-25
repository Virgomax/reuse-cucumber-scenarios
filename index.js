var enableScenarioCalls = function (showStepdefFiles=false) {
  var StepFunctionsStore = require('./stepFunctionsStore');
  var {stepDefinitions,stepFunctions} = require('./stepFunctions')(showStepdefFiles);
  StepFunctionsStore.stepDefinitions=stepDefinitions;
  StepFunctionsStore.stepFunctions=stepFunctions;
  var GWTsteps = require('./GWT');
  return;
};

module.exports = enableScenarioCalls;