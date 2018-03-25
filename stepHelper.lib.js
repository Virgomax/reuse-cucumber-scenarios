const stepHelper = {
  defaultTimeout: 5000,
  toFunctionName(stepPattern){  //converts stepName to functionName
    //stepPattern = 'the user {int} is on {string} page';  returns 'the_user_INT_is_on_STRING_page'
    var paramArray = stepPattern.match(/\{(.*?)\}/g);  // this regex: https://stackoverflow.com/a/1493071/7491858
    var stepPatternUpperParam;
    if(paramArray!==null){
      stepPatternUpperParam = paramArray.reduce((a,b)=>{
        var c = b.slice(1,-1).toUpperCase();
        return a.replace(b,c);
      },stepPattern);
    }
    else{
      stepPatternUpperParam = stepPattern;
    }
    return stepPatternUpperParam.replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "_");  //keep only letters, numbers and spaces then replace spaces with underscores
  },

  toStepFunctions(stepDefinitions){
    stepFunctions = {};
    Object.keys(stepDefinitions).map((key)=>{
      var stepPattern = stepDefinitions[key].stepPattern;
      var stepTimeout = stepDefinitions[key].stepTimeout || this.defaultTimeout;
      var funcName = this.toFunctionName(stepPattern);
      var stepFunction = stepDefinitions[key].stepFunction;
      stepFunction.stepPattern = stepPattern;
      stepFunction.stepTimeout = stepTimeout;
      stepFunctions[funcName] = stepFunction;
    });
    return stepFunctions;
  },

  promiseTimeout(ms, promise){

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Reuse-cucumber-scenarios says: Function timed out after '+ ms + ' milliseconds.')
      }, ms)
    });
  
    // Returns a race between our timeout and the passed in promise
    return Promise.race([
      promise,
      timeout
    ]);
  }
}

module.exports = stepHelper;