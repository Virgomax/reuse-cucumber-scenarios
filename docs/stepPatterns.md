## Step Patterns: What are the pre-defined step patterns?

Once you [enabled this package](/docs/enabling.md), in your .feature files, you'll be able to use the following steps:

```gherkin
Given the scenario "@scenario_tag"
```
(see more: [Calling Scenarios](/docs/callingScenarios.md))


```gherkin
When the scenario "@scenario_tag" happens
```
(see more: [Calling Scenarios](/docs/callingScenarios.md))


```gherkin
Given the scenario "@scenario_tag" with parameters
"""
#JSON object containing step parameters
"""
```
(see more:[Step Parameters](/docs/stepParameters.md))


```gherkin
When the scenario "@scenario_tag" happens with parameters
"""
#JSON object containing step parameters
"""
```
(see more:[Step Parameters](/docs/stepParameters.md))


```gherkin
Given the variable "$variable_name" is equal to "value"
```
(see more:[Gherkin Variables](/docs/gherkinVariables.md))


```gherkin
Given the variable "$variable_name" is equal to
"""
#JSON object
"""
```
(see more:[Gherkin Variables](/docs/gherkinVariables.md))


```gherkin
Given the scenario "@$scenario_function_tag" where variable "$variable_name" is "value_to_replace"
```
(see more:[Scenario Functions](/docs/scenarioFunctions.md))


```gherkin
Given the scenario "@$scenario_function_tag" where variables
"""
#JSON object containing variables and values for replacing.
"""
```
(see more:[Scenario Functions](/docs/scenarioFunctions.md))


```gherkin
Given the scenario "@$scenario_function_tag" for variable "$variable_name" from "initial_integer" to "last_integer"
```
(see more:[Scenario Functions](/docs/scenarioFunctions.md))


Where `@scenario_tag` and `@$scenario_function_tag` are a unique tags that identify some previous scenarios and `$variable_name` is a variable that you define and remains across scenarios and `.feature` files.
(see more:[Scenario Functions](/docs/scenarioFunctions.md))