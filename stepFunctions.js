const glob = require('glob');
const path = require('path');
const sHelper = require('./stepHelper.lib');

var stepDefinitions = {};
var stepFunctions = {};

//glob.sync(__dirname + '/../' + '/**/*.stepdef.js').forEach(function (file) {
glob.sync('/**/*.stepdef.js').forEach(function (file) {
  //console.log('file', file);
  const stepDefFile = require(path.resolve(file));
  const fileName = path.parse(file).name.slice(0, -8);
  console.log('fileName',fileName);
  stepDefinitions[fileName] = stepDefFile;
  const stepFuncFile = sHelper.toStepFunctions(stepDefFile);
  stepFunctions = { ...stepFunctions, ...stepFuncFile };
});

console.log('stepDefinitions',stepDefinitions);
console.log('stepFunctions',stepFunctions);

module.exports = { stepDefinitions, stepFunctions };