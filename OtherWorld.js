const ScStore = require('./ScenarioStore');

var OtherWorld = {
  functionList: [],
  functionTimeout: 0,
  currentScenarioTag: undefined,
  saved: false,
  
  setCurrentScenarioTag(currentScenarioTag){
    this.currentScenarioTag = currentScenarioTag.replace('@','');
  },

  appendStepFunction(functionName,functionArguments,functionTimeout) {
    var newFunctionElem = {functionName,functionArguments,functionTimeout};
    this.functionList = this.functionList.concat(newFunctionElem);
    this.functionTimeout += functionTimeout;
    //console.log("this.functionList",JSON.stringify(this.functionList, null, 4));
  },

  saveInScStore() {
    if(!this.saved)
    {
      ScStore.scenarios[this.currentScenarioTag] = {functionList: this.functionList, functionTimeout: this.functionTimeout};
      this.saved = true;
    }
  },

  resetProperties(){
    this.functionList = [];
    this.functionTimeout = 0;
    this.currentScenarioTag = undefined;
    this.saved = false;
  }
}

module.exports = OtherWorld;