const GWTsteps = (function(){
  const cucumber = require('cucumber');
  const { stepFunctions, stepDefinitions } = require('./stepFunctionsStore');
  const sHelper = require('./stepHelper.lib');
  var arity = require('util-arity');
  const OtherWorld = require('./OtherWorld');
  
  var fn = function(worldMethod,thisStepDef){
    return async function () {
      //console.log('arguments', arguments);
      var stepFunctionName = sHelper.toFunctionName(thisStepDef.stepPattern);
      OtherWorld[worldMethod](stepFunctionName, arguments,thisStepDef.stepTimeout);
      await stepFunctions[stepFunctionName](...arguments);
      return;
    };
  };
  
  cucumber.Before(function(scenario){
    var tags = scenario.pickle.tags; //get tags from this scenario
    OtherWorld.resetProperties();
    OtherWorld.setCurrentScenarioTag(tags[0].name); // set current scenario Tag in CustomWorld
    //console.log('-------------NEW SCENARIO-----------');
    return;
  });
   
  Object.keys(stepDefinitions).forEach(fileName => {
    Object.keys(stepDefinitions[fileName]).forEach(stepDef => {
      const thisStepDef = stepDefinitions[fileName][stepDef];
      const cucumberMethod = thisStepDef.stepMethod;
      var worldMethod = 'appendStepFunction';
      if(cucumberMethod==='Then'){worldMethod='saveInScStore';}
      const fnCucumber = arity(thisStepDef.stepFunction.length, fn(worldMethod,thisStepDef)); //sets number of arguments to function returned from "fn(worldMethod)"
      cucumber[cucumberMethod](thisStepDef.stepPattern,{ timeout: thisStepDef.stepTimeout || sHelper.defaultTimeout},fnCucumber);
    });
  });
})();

module.exports = GWTsteps;





