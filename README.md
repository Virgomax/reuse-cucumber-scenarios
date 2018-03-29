# Reuse-cucumber-scenarios.js

Reuse-cucumber-scenarios is a package that lets you call a cucumber scenario in a single step.
The goal is to avoid step repetition (keep your .feature files DRY). 
You can :
 - , from a step in a scenario, call another scenario by its tag and set the parameters for each step it has.
 - define scenario functions with variables, then call it by its tag in a different scenario and set actual values for the variables.

## Install in Node.js

reuse-cucumber-scenarios.js is available as an npm module.

``` shell
$ npm install --save-dev reuse-cucumber-scenarios
```

## Usage

* [Enabling this package](/docs/enabling.md)
* [Step Patterns](/docs/stepPatterns.md)
* [Defining Steps](/docs/definingSteps.md)
* [Calling Scenarios](/docs/callingScenarios.md)
* [Step Parameters](/docs/stepParameters.md)
* [Gherkin Variables](/docs/gherkinVariables.md)
* [Scenario Functions](/docs/scenarioFunctions.md)


## Enjoy the Power

Now, we can see how useful is calling scenarios as if they were single steps.

Please, share if you like it and/or give me a star :D
