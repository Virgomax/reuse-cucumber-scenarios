## Defining steps of reusable scenarios

When we try to run cucumber without having defined the steps, it will write for us a template of each missing step.
Each template is something like this:

```javascript
When('the action {string} happens {int} times', function (callback) {
   // Write code here that turns the phrase above into concrete actions
   callback(null, 'pending');
});
```

So, what we need to do in order to define steps that belong to a reusable scenario is:

1) Do NOT create a step definition using the cucumber methods `When`, `Given`, `Then`. You can still do that for steps that do NOT belong to reusable scenarios. 
2) Create a file with extension `.stepdef.js`
3) Inside this file we have to export an Object containing with the following format:

```javascript
//myfile.stepdef.js          //you can use any file name. You can have many files with extention .stepdef.js
const stepDefinitions = {    //you can use any name for this object as long as it's the same that you export
  someStepObject_1: {            //you can use any key for each step definition
    stepMethod: 'When',
    stepPattern: 'the action {string} happens {string} times',     //right now, regex is not supported //string variables recommended
    stepTimeout: 10000,      //optional attribute
    
    //the number of parameters in the following function has to match the number of parameters in your step pattern
    stepFunction: async function(actionId, numberOfTimes){            //if you want, you can use asynchronous functions 
      // Write code here that turns the phrase above into concrete actions
      console.log('cucumberWorld',this);    //you can access cucumber's World from here as long as you don't use an arrow function
      return;
    }
  },
  someOtherStepObject_2: {    // you can have many step definitions
    stepMethod: 'Given',
    stepPattern: 'some condition {string}',    
    stepTimeout: 7000,      
    
    //the number of parameters in the following function has to match the number of parameters in your step pattern
    stepFunction: function(conditionId){  
      // Write code here that turns the phrase above into concrete actions
      
      return;
    }
  }
};

module.exports = stepDefinitions;
```
Inside a step definition object, you have to use the keys `stepMethod`, `stepPattern`, `stepFunction` and `stepTimeout`(this last one is optional).
By creating your step definitions in this way, you are giving them the capability of being part of a reusable scenario. 
You can do this with any step definition and it will still work as if it was defined using the traditional `When`, `Given`, `Then` cucumber methods.


[<< Step Patterns](/docs/stepPatterns.md)________________[Calling Scenarios >>](/docs/callingScenarios.md)