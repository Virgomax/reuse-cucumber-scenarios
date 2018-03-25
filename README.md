# Reuse-cucumber-scenarios.js

Reuse-cucumber-scenarios is a package that lets you call a cucumber scenario in a single step.
The goal is to avoid step repetition (keep your .feature files DRY). 
You can call a scenario by its tag and set the parameters for each step it has.

## Install in Node

reuse-cucumber-scenarios.js is available as an npm module.

``` shell
$ npm install --save-dev reuse-cucumber-scenarios
```

## Usage

### 1. Enabling the package
Once you installed this package, you need to require it inside a `.steps.js` file and call it as a function:

```javascript
// randomFileName.steps.js
const enableScenarioCalling = require('reuse-cucumber-scenarios');
enableScenarioCalling();

//Here, you can add more step definitions using the cucumber methods: When, Given, Then.
```

If you want "reuse-cucumber-scenarios" to show messages about it's execution, you can pass `true` as argument of the function:

```javascript
// randomFileName.steps.js
const enableScenarioCalling = require('reuse-cucumber-scenarios');
enableScenarioCalling(true);
```

### 2. Using pre-defined step patterns
#### 2.1. What are the pre-defined step patterns?
Now, in your .feature files, you'll be able to use the following steps:

```gherkin
Given the scenario "scenario_tag"
```
```gherkin
When the scenario "scenario_tag" happens
```
Where `@scenario_tag` is a unique tag that identifies some previous scenario. Do not use the symbol `@` when calling scenarios.

You can also set parameters for each step in the scenario you are calling by adding ` with parameters` at the end.
Use a [docString](https://cucumber.io/docs/reference#doc-strings) to enter a JSON object where each key is a step number(as shown in the following example, the keys are:  "1","2","3",...) 
and each value is an array containing the parameters of that step.
If you use ` with parameters`, you must enter all the needed parameters for each step.

```gherkin
Given the scenario "scenario_tag" with parameters
"""
{
"1": ["step1_param1", "step1_param2"],
"2": ["step2_param1", "step2_param2", "step2_param3"],
"3": ["step3_param1", "step3_param2", "step3_param3"],
}
"""
```
If a step does not contain parameters just don't use that key. 
In the next example, key `"3"`is missing because the step 3 of the scenario whose tag is `@scenario_tag` does not have arguments.
The step parameters can be either strings or numbers as shown in the following example.
Optionally, you can add a timeout integer value in milliseconds.

```gherkin
When the scenario "scenario_tag" happens with parameters
"""
{
"1": [11, 12],
"2": ["step2_param1", "step2_param2", 23],
"4": ["step4_param1", 42, "step4_param3", "step4_param4"],
"timeout" : 12000
}
"""
```

#### 2.2. Example
Let's see an example of a reusable scenario:

```gherkin
#comment
feature: my DRY feature 

   @task1
   Scenario: do some reusable task 
      Given some condition "condition_1"
      When the action "action_1" happens 5 times
      And the action "action_2" happens
      Then the result should be "result_1"
   
   @task2
   Scenario: execute a previous scenario and do some more steps
      Given the scenario "task1" with parameters
      """
      {
        "1":["other_condition_1"],
        "2":["other_action_1", 12],
        "3":["another_action_2"],
        "4":["different_result_1"]
      }
      """
      And the action "action_3" happens
      Then the result should be "result_2"

```
In this example the step:

```gherkin
      Given the scenario "task1" with parameters
      """
      {
        "1":["other_condition_1"],
        "2":["other_action_1", 12],
        "3":["another_action_2"],
        "4":["different_result_1"]
      }
      """
```
is equivalent to:

```gherkin
      Given some condition "other_condition_1"
      When the action "other_action_1" happens 12 times
      And the action "another_action_2" happens
      Then the result should be "different_result_1"
```
If you don't use `with parameters`, the scenario will be executed using the parameters used previously.
By default, the timeout of this composite step is the sum of the timeout of its step components (by default 5000 per step).

#### 2.3. Entering nested scenario parameters

Let's say we have a feature where scenario "task3" calls scenario "task2", which in turn calls scenario "task1". We want to use 
 `with parameters` for both scenario calls(call of "task1" from "task2" and call of "task2" from "task3"). Then, you have to scape the quotes `\"` when entering the parameters of "task1" in the JSON object in "task3":
 
```gherkin
@task3
When the scenario "task2" happens with parameters
"""
{
"1": ["task2_step1_param1", "{\"1\":[\"task1_step1_param1\"], \"2\":[\"task1_step2_param1\",\"task1_step2_param2\"]}"],
"2": ["task2_step2_param1", "task2_step2_param2", 23],
"4": ["task2_step4_param1", 42, "task2_step4_param3", "task2_step4_param4"],
"timeout" : 12000
}
"""
```

### 3. Defining steps of reusable scenarios
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
    stepPattern: 'the action {string} happens {int} times',     //right now, regex is not supported
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

## Enjoy the Power

Now, we can run cucumber as we are used to and see how useful is calling scenarios as if they were single steps.

Please, share if you like it and/or give me a star :D
