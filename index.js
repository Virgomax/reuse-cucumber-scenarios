const OtherWorld = require('./OtherWorld');

var enableScenarioCalls = function (showStepdefFiles=false) {
  var StepFunctionsStore = require('./stepFunctionsStore');
  OtherWorld.showStepdefFiles = showStepdefFiles;
  var {stepDefinitions,stepFunctions} = require('./stepFunctions')(showStepdefFiles);
  StepFunctionsStore.stepDefinitions=stepDefinitions;
  StepFunctionsStore.stepFunctions=stepFunctions;
  var GWTsteps = require('./GWT');
  return;
};

module.exports = enableScenarioCalls;