const stepFunc = function(showStepdefFiles=false){
  const glob = require('glob');
  const path = require('path');
  const sHelper = require('./stepHelper.lib');

  var stepDefinitions = {};
  var stepFunctions = {};
  var totalFiles = 0;

  const fileFunction = function (file) {
    const stepDefFile = require(path.resolve(file));
    const fileName = path.parse(file).name.slice(0, -8);
    if(showStepdefFiles&&fileName!=='reuse-cucumber-scenarios')
    {
      totalFiles++;
      console.log('   Reading .stepdef.js file: ',path.parse(file).base)
    };
    stepDefinitions[fileName] = stepDefFile;
    const stepFuncFile = sHelper.toStepFunctions(stepDefFile);
    stepFunctions = { ...stepFunctions, ...stepFuncFile };

  }

  fileFunction(__dirname + '/reuse-cucumber-scenarios.stepdef.js');
  showStepdefFiles?console.log('/----- START of reuse-cucumber-scenarios message ----/'):null;
  glob.sync(__dirname + '/../../' +'{,/!(node_modules)/**/}*.stepdef.js').forEach(fileFunction);
  
  if(showStepdefFiles){
    console.log('   ----------------------------------');
    console.log('   Total .stepdef.js files: '+ totalFiles);
    console.log('/----- END of reuse-cucumber-scenarios message ------/')
  };

  return { stepDefinitions, stepFunctions };
}

module.exports = stepFunc;