const sHelper = require('./stepHelper.lib');
const ScStore = require('./ScenarioStore');
const OtherWorld = require('./OtherWorld');

const runScenario = async (scenarioTag)=>{
  const {stepFunctions} = require('./stepFunctionsStore');
  var functionList = ScStore.scenarios[scenarioTag].functionList;
  if(OtherWorld.showStepdefFiles)
  {console.log('Reuse-cucumber-scenarios says: Starting execution of scenario "@'+scenarioTag+'"');}
  for(var i = 0; i< functionList.length;i++)
  {await stepFunctions[functionList[i].functionName]
    .bind(OtherWorld.worldToBind)(...functionList[i].functionArguments);}
  if(OtherWorld.showStepdefFiles)
  {console.log('Reuse-cucumber-scenarios says: Scenario "@'+scenarioTag+'" was succefully executed.');}
  return;
};

const runScenarioWithParameters = async (scenarioTag,paramsObj)=>{
  const {stepFunctions} = require('./stepFunctionsStore');
  var functionList = ScStore.scenarios[scenarioTag].functionList;
  //console.log('functionList',functionList);
  if(OtherWorld.showStepdefFiles)
  {console.log('Reuse-cucumber-scenarios says: Starting execution of scenario "@'+scenarioTag+'"');}
  for(var i = 0; i< functionList.length;i++)
  {
    let defaultArgs = functionList[i].functionArguments;
    let len = Object.keys(defaultArgs).length;
    //console.log('paramsObj[i+1]',paramsObj[i+1]);
    let thisParams = (paramsObj[i+1] || []);
    let args = thisParams.concat(defaultArgs[len-1]);
    //console.log("args step"+(i+1).toString(),args);
    //console.log("functionArguments step"+(i+1).toString(), defaultArgs)
    let thisFunc = stepFunctions[functionList[i].functionName];
    if(thisParams.length >= (thisFunc.length-1))
    {await thisFunc.bind(OtherWorld.worldToBind)(...args);}
    else{
      throw new Error(`Reuse-cucumber-scenarios says: The step pattern "${thisFunc.stepPattern}" got a wrong number 
      of parameters: ${thisParams.length} parameters.`);
    }
  }
  if(OtherWorld.showStepdefFiles)
  {console.log('Reuse-cucumber-scenarios says: Scenario "@'+scenarioTag+'" was succefully executed.');}
  return;
}; 


const runScenarioWithTimeout = async (scenarioTag) =>{
  var thisScenario = ScStore.scenarios[scenarioTag];
  if(thisScenario)
  {
    var timeout = ScStore.scenarios[scenarioTag].functionTimeout;
    try{ 
      await sHelper.promiseTimeout(timeout,runScenario(scenarioTag));
    }
    catch(err){ throw new Error(err);}
    return;
  }
  else{throw new Error(`Reuse-cucumber-scenarios says: The scenario "@${scenarioTag}" has to be defined and executed before calling it.`);}
};

const runScenarioWithParametersWithTimeout = async (scenarioTag, parametersString) =>{
  var thisScenario = ScStore.scenarios[scenarioTag];
  if(thisScenario)
  {
    var paramsObj = JSON.parse(parametersString);
    var timeout = paramsObj['timeout'] || ScStore.scenarios[scenarioTag].functionTimeout;
    try{    
      await sHelper.promiseTimeout(timeout,runScenarioWithParameters(scenarioTag, paramsObj));
    }
    catch(err){throw new Error(err);}
    return;
  }
  else{throw new Error(`Reuse-cucumber-scenarios says: The scenario "@${scenarioTag}" has to be defined and executed before calling it.`);}
};

const maxScenarioTimeout = 10000000;

const stepDefinitions = {
  step0: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: runScenarioWithTimeout
  },
  step1: {
    stepMethod: 'When',
    stepPattern: 'the scenario {string} happens',
    stepTimeout: maxScenarioTimeout,
    stepFunction: runScenarioWithTimeout
  },
  step2: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string} with parameters {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: runScenarioWithParametersWithTimeout
  },
  step3: {
    stepMethod: 'When',
    stepPattern: 'the scenario {string} happens with parameters {string}',
    stepTimeout: maxScenarioTimeout,
    stepFunction: runScenarioWithParametersWithTimeout
  },
  step4: {
    stepMethod: 'Given',
    stepPattern: 'the scenario {string} with parameters',
    stepTimeout: maxScenarioTimeout,
    stepFunction: runScenarioWithParametersWithTimeout
  },
  step5: {
    stepMethod: 'When',
    stepPattern: 'the scenario {string} happens with parameters',
    stepTimeout: maxScenarioTimeout,
    stepFunction: runScenarioWithParametersWithTimeout
  }
};


module.exports = stepDefinitions;
