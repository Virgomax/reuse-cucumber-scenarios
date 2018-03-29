const OtherWorld = require('./OtherWorld');

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
  },

  replaceVariables(argsArray, varObj) {
    //console.log('arguments',arguments);
    return Object.keys(argsArray).map(key => {
      var arg = argsArray[key];
      var replacedArg;
      if(typeof(arg)==='string')
      {
        replacedArg = this.replaceVariable(arg, varObj);
      }
      else
      {replacedArg = arg;}
      //console.log('replacedArg',replacedArg);
      return replacedArg;
    });
  },
  
  replaceVariable(str_arg_0, varObj ={}) {
    //console.log('ARGUMENTS',arguments);
    var str_arg = str_arg_0.toString();
    var deepVarsArray = this.getDeepest(str_arg);
    if (deepVarsArray.length === 0) {
      return this.getNested(varObj,str_arg) || this.getNested(OtherWorld.varStore,str_arg) || str_arg;
    }
    else {
      var str_arg_1 = this.replaceDeepest(str_arg, varObj);
      return this.replaceVariable(str_arg_1, varObj);
    }
  },

  replaceDeepest (str_arg, varObj){
    var newStr_arg='';
    var deepVarsArray = this.getDeepest(str_arg);
    var parts=[];
    var posInit = 0;
    for (var i=0;i<deepVarsArray.length;i++) {
      var [pos, last, depth, str_deepest] = deepVarsArray[i];
      parts.push(str_arg.slice(posInit,pos-1));
      posInit = last+1;
    }
    parts.push(str_arg.slice(posInit));
  
    for (var i=0;i<deepVarsArray.length;i++) {
      var replacedValue = this.getNested(varObj,deepVarsArray[i][3]) || this.getNested(OtherWorld.varStore,deepVarsArray[i][3]);
      newStr_arg+=parts[i]+'.'+replacedValue;
    }
    newStr_arg+=parts[parts.length-1];
    return newStr_arg;
  },

  getDeepest (str_arg) {
    var depth = 0;
    var maxDepth = 0;
    var match, pos, last, bracketsObj = [];
    var regex = /(\[\$|\])/g;
    var brackets = str_arg.match(regex);
  
    for (var i=0;i<(brackets||[]).length;i++) {
      bracket=brackets[i];
      if (bracket === "[$") 
      {
        depth++;
        if (depth > maxDepth) 
        { 
          maxDepth = depth; 
        }
      }
      if (bracket === "]") 
      {
        depth--; 
      }
      match = regex.exec(str_arg);
      pos = regex.lastIndex - match[0].length;
      bracketsObj.push({ bracket, depth, pos});
    }
  
    var maxDepthArray = bracketsObj.map((bracketObj,i)=>{
      if(bracketObj.depth===maxDepth)
      {return i;}
    }).filter(elem=>(elem!=null)?true:false);
  
    return maxDepthArray.map(maxI=>{
      last = bracketsObj[maxI+1].pos;
      pos = bracketsObj[maxI].pos+1;
      str_deepest = str_arg.slice(pos,last);
      return [pos, last, maxDepth, str_deepest];
    });
  },

  getNested (theObject, path, separator='.') {
    try {
        return path.
                replace('[', separator).replace(']','').
                split(separator).
                reduce(
                    function (obj, property) { 
                        return obj[property];
                    }, theObject
                );
                    
    } catch (err) {
        return undefined;
    }   
  },
}

module.exports = stepHelper;