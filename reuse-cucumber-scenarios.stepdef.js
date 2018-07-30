const sHelper = require('./stepHelper.lib');
const ScStore = require('./scenarioStore');
const OtherWorld = require('./OtherWorld');
var arity = require('util-arity');

const runScenario = function (funcArgs = {}) { //func=(a=>a) : returns first argument
  return async function (at_scenarioTag) {
    //console.log('at_scenarioTag',at_scenarioTag);
    var scenarioTag = at_scenarioTag.replace('@','');
    const { stepFunctions } = require('./stepFunctionsStore');
    var functionList = ScStore.scenarios[scenarioTag].functionList;
    if (OtherWorld.showStepdefFiles) { console.log('Reuse-cucumber-scenarios says: Starting execution of scenario "@' + scenarioTag + '"'); }
    for (var i = 0; i < functionList.length; i++) {
      try{
        await stepFunctions[functionList[i].functionName]
        .bind(OtherWorld.worldToBind)(...sHelper.replaceVariables(functionList[i].functionArguments, funcArgs));
      }
      catch(err){throw new Error(err.stack);}
    }
    if (OtherWorld.showStepdefFiles) { console.log('Reuse-cucumber-scenarios says: Scenario "@' + scenarioTag + '" was succefully executed.'); }
    return;
  };
}



const runScenarioWithParameters = function (func = (a => a), funcArgs = {}) {
  return async function (at_scenarioTag, str_paramsObj){
    var paramsObj = JSON.parse(str_paramsObj);
    var scenarioTag = at_scenarioTag.replace('@','');
    const { stepFunctions } = require('./stepFunctionsStore');
    var functionList = ScStore.scenarios[scenarioTag].functionList;
    //console.log('functionList',functionList);
    if (OtherWorld.showStepdefFiles) { console.log('Reuse-cucumber-scenarios says: Starting execution of scenario "@' + scenarioTag + '"'); }
    for (var i = 0; i < functionList.length; i++) {
      let defaultArgs = functionList[i].functionArguments;
      let len = Object.keys(defaultArgs).length;
      //console.log('paramsObj[i+1]',paramsObj[i+1]);
      let thisParams = (paramsObj[i + 1] || []);
      let args = thisParams.concat(defaultArgs[len - 1]);
      //console.log("args step"+(i+1).toString(),args);
      //console.log("functionArguments step"+(i+1).toString(), defaultArgs)
      let thisFunc = stepFunctions[functionList[i].functionName];
      if (thisParams.length >= (thisFunc.length - 1)) { 
        try{
          await thisFunc.bind(OtherWorld.worldToBind)(...func(args, funcArgs)); 
        }
        catch(err){throw new Error(err.stack);}
      }
      else {
        throw new Error(`Reuse-cucumber-scenarios says: The step pattern "${thisFunc.stepPattern}" got a wrong number 
        of parameters: ${thisParams.length} parameters.`);
      }
    }
    if (OtherWorld.showStepdefFiles) { console.log('Reuse-cucumber-scenarios says: Scenario "@' + scenarioTag + '" was succefully executed.'); }
    return;
  };
};

const defineVariable = function (varName, varValue){
  OtherWorld.varStore[varName] = JSON.parse(varValue);
  if (OtherWorld.showStepdefFiles) { console.log(`Reuse-cucumber-scenarios says: ${varName} = ${varValue}`) }
  return;
}



const runScenarioUsingVariable = async function (at_scenarioTag, varName, varValue){
  
  await runScenario( { [varName]: sHelper.replaceVariable(varValue) })(at_scenarioTag);
  return;
}

const runScenarioUsingVariables = async function (at_scenarioTag, str_varObj){
  var varObj = JSON.parse(str_varObj);
  await runScenario( varObj)(at_scenarioTag);
  return;
}

const runScenarioUsingVariableFromTo = async function (at_scenarioTag, varName, startValue, endValue){
  var startVal = sHelper.replaceVariable(startValue);
  var endVal = sHelper.replaceVariable(endValue);
  for(var thisValue=parseInt(startVal);thisValue<=parseInt(endVal);thisValue++){
    //console.log("thisValue",thisValue);
    await runScenario({ [varName]: thisValue })(at_scenarioTag);
  }
  return;
}







const withDefaultTimeout = function (rawFunction) {
  var fn = async function () {
    var scenarioTag = arguments[0].replace('@','');
    var thisScenario = ScStore.scenarios[scenarioTag];
    if (thisScenario) {
      var timeout = ScStore.scenarios[scenarioTag].functionTimeout;
      try {
        await sHelper.promiseTimeout(timeout, rawFunction(...arguments));
      }
      catch (err) { throw new Error(err); }
      return;
    }
    else { throw new Error(`Reuse-cucumber-scenarios says: The scenario "@${scenarioTag}" has to be defined and executed before calling it.`); }
  };

  return arity(rawFunction.length,fn);
}


const withCustomTimeout = function (rawFunction) {
  var fn = async function () {
    var scenarioTag = arguments[0].replace('@','');
    //console.log('arguments1',arguments);
    var str_paramsObj =  arguments[arguments.length-2];
    var thisScenario = ScStore.scenarios[scenarioTag];
    if (thisScenario) {
      var paramsObj = JSON.parse(str_paramsObj);
      //console.log('paramsObj',paramsObj);
      var timeout = paramsObj['timeout'] || ScStore.scenarios[scenarioTag].functionTimeout;
      try {
        await sHelper.promiseTimeout(timeout, rawFunction(...arguments));
      }
      catch (err) { throw new Error(err); }
      return;
    }
    else { throw new Error(`Reuse-cucumber-scenarios says: The scenario "@${scenarioTag}" has to be defined and executed before calling it.`); }
  };
  return arity(rawFunction.length,fn);
}

const maxScenarioTimeout = 10000000;

const stepDefinitions = {
  step0: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withDefaultTimeout(runScenario())
  },
  step1: {
    stepMethod: 'When',
    stepPattern: 'the scenario {string} happens',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withDefaultTimeout(runScenario())
  },
  step2: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string} with parameters {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withCustomTimeout(runScenarioWithParameters())
  },
  step3: {
    stepMethod: 'When',
    stepPattern: 'the scenario {string} happens with parameters {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withCustomTimeout(runScenarioWithParameters())
  },
  step4: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string} with parameters',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withCustomTimeout(runScenarioWithParameters())
  },
  step5: {
    stepMethod: 'When',
    stepPattern: 'the scenario {string} happens with parameters',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withCustomTimeout(runScenarioWithParameters())
  },
  step6: {
    stepMethod: 'Given',
    stepPattern: 'the variable {string} is equal to {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: defineVariable
  },
  step7: {
    stepMethod: 'Given',
    stepPattern: 'the variable {string} is equal to',
    stepTimeout: maxScenarioTimeout,
    stepFunction: defineVariable
  },
  step8: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string} where variable {string} is {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withDefaultTimeout(runScenarioUsingVariable)
  },
  step9: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string} where variables',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withCustomTimeout(runScenarioUsingVariables)
  },
  step10: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string} for variable {string} from {string} to {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: withDefaultTimeout(runScenarioUsingVariableFromTo)
  },
};


module.exports = stepDefinitions;
