const GWTsteps = (function(){
  const cucumber = require('cucumber');
  const { stepFunctions, stepDefinitions } = require('./stepFunctionsStore');
  const sHelper = require('./stepHelper.lib');
  var arity = require('util-arity');
  const OtherWorld = require('./OtherWorld');
  
  
  var fn = function(thisStepDef){
    return async function () {
      var stepFunctionName = sHelper.toFunctionName(thisStepDef.stepPattern);
      OtherWorld.appendStepFunction(stepFunctionName, arguments,thisStepDef.stepTimeout);
      if(OtherWorld.currentScenarioTag && !OtherWorld.isScenarioFunction)
      {
        try{
          await stepFunctions[stepFunctionName].bind(OtherWorld.worldToBind)(...sHelper.replaceVariables(arguments));
        }catch(err){throw new Error(err.stack);}
      }
      return;
    };
  };
  
  cucumber.Before(function(scenario){
    var tags = scenario.pickle.tags; //get tags from this scenario
    OtherWorld.resetProperties();
    if(tags.length>0)
    { OtherWorld.setCurrentScenarioTag(tags[0].name); }// set current scenario Tag in CustomWorld
    //console.log('-------------NEW SCENARIO-----------',tags[0].name);
    OtherWorld.worldToBind = this;
    return;
  });
   
  Object.keys(stepDefinitions).forEach(fileName => {
    Object.keys(stepDefinitions[fileName]).forEach(stepDef => {
      const thisStepDef = stepDefinitions[fileName][stepDef];
      const cucumberMethod = thisStepDef.stepMethod;
      const fnCucumber = arity(thisStepDef.stepFunction.length, fn(thisStepDef)); //sets number of arguments to function returned from "fn(worldMethod)"
      cucumber[cucumberMethod](thisStepDef.stepPattern,{ timeout: thisStepDef.stepTimeout || sHelper.defaultTimeout},fnCucumber);
    });
  });

  cucumber.After(function(scenario){
    if(OtherWorld.currentScenarioTag)
    {  OtherWorld.saveInScStore(); }
    return;
  });
})();

module.exports = GWTsteps;


