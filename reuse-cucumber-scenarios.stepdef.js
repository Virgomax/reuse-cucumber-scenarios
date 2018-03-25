const sHelper = require('./stepHelper.lib');
const ScStore = require('./ScenarioStore');

const runScenario = async (scenarioTag)=>{
  const {stepFunctions} = require('./stepFunctionsStore');
  var functionList = ScStore.scenarios[scenarioTag].functionList;
  for(var i = 0; i< functionList.length;i++)
  {await stepFunctions[functionList[i].functionName](...functionList[i].functionArguments);}
  return;
};

const runScenarioWithParameters = async (scenarioTag,parametersString)=>{
  var paramsObj = JSON.parse(parametersString);

  const {stepFunctions} = require('./stepFunctionsStore');
  var functionList = ScStore.scenarios[scenarioTag].functionList;
  for(var i = 0; i< functionList.length;i++)
  {
    let defaultArgs = functionList[i].functionArguments;
    let len = Object.keys(defaultArgs).length;
    let args = paramsObj[i+1].concat(defaultArgs[len-1]);
    //console.log("args step"+(i+1).toString(),args);
    //console.log("functionArguments step"+(i+1).toString(), defaultArgs)
    if(args===undefined){args=defaultArgs;}
    await stepFunctions[functionList[i].functionName](...args);
  }
  return;
}; 


const runScenarioWithTimeout = async (scenarioTag) =>{
  var timeout = ScStore.scenarios[scenarioTag].functionTimeout;
  try{ 
    //console.log('set timeout to '+ timeout);
    await sHelper.promiseTimeout(timeout,runScenario(scenarioTag));
  }
  catch(err){ throw new Error('Function timed out after '+timeout+' milliseconds');}
  return;
};

const runScenarioWithParametersWithTimeout = async (scenarioTag, parametersString) =>{
  var paramsObj = JSON.parse(parametersString);
  var timeout = paramsObj['timeout'] || ScStore.scenarios[scenarioTag].functionTimeout;
  try{    
    //console.log('set timeout to '+ timeout);
    await sHelper.promiseTimeout(timeout,runScenario(scenarioTag, parametersString));
  }
  catch(err){ throw new Error('Function timed out after '+timeout+' milliseconds');}
  return;
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
