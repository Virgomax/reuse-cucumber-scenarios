## Step parameters: How do you enter step parameters?

The two step patterns related to step parameters are:

```gherkin
Given the scenario "@scenario_tag" with parameters
"""
#JSON object containing step parameters
"""
```

```gherkin
When the scenario "@scenario_tag" happens with parameters
"""
#JSON object containing step parameters
"""
```

Where `@scenario_tag` is a unique tag that identifies a previous scenario.

Besides making simple scenario calls, you can also set parameters for each step in the scenario you are calling by using ` with parameters` at the end.
Use a [docString](https://cucumber.io/docs/reference#doc-strings) to enter a JSON object in which each key is a step number(as shown in the following example, the keys are:  "1","2","3",...) 
and each value is an array containing the parameters of that step.
If you use ` with parameters`, you must enter all the needed parameters for each step.

```gherkin
Given the scenario "@scenario_tag" with parameters
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
The step parameters can be either strings or numbers, however, it's highly recommended to use always strings since it is the only way to be able to work with [gherkin variables](/docs/gherkinVariables.md).
Optionally, you can add a timeout integer value in milliseconds.

```gherkin
When the scenario "@scenario_tag" happens with parameters
"""
{
"1": ["11", "12"],
"2": ["step2_param1", "step2_param2", "23"],
"4": ["step4_param1", "42", "step4_param3", "step4_param4"],
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
      When the action "action_1" happens "5" times
      And the action "action_2" happens
      Then the result should be "result_1"
   
   @task2
   Scenario: execute a previous scenario and do some more steps
      Given the scenario "@task1" with parameters
      """
      {
        "1":["other_condition_1"],
        "2":["other_action_1", "12"],
        "3":["another_action_2"],
        "4":["different_result_1"]
      }
      """
      And the action "action_3" happens
      Then the result should be "result_2"

```
In this example the step:

```gherkin
      Given the scenario "@task1" with parameters
      """
      {
        "1":["other_condition_1"],
        "2":["other_action_1", "12"],
        "3":["another_action_2"],
        "4":["different_result_1"]
      }
      """
```
is equivalent to:

```gherkin
      Given some condition "other_condition_1"
      When the action "other_action_1" happens "12" times
      And the action "another_action_2" happens
      Then the result should be "different_result_1"
```

If you don't specify a timeout, the default value is the composite step is the sum of the timeout of its step components (by default 5000 per step).

#### 2.3. Entering nested scenario parameters

Let's say we have a feature where scenario "@task3" calls scenario "@task2", which in turn calls scenario "@task1". We want to use 
 `with parameters` for both scenario calls(call of "@task1" from "@task2" and call of "@task2" from "@task3"). Then, you have to scape the quotes `\"` when entering the parameters of "@task1" in the JSON object in "@task3":
 
```gherkin
@task3
When the scenario "@task2" happens with parameters
"""
{
"1": ["task2_step1_param1", "{\"1\":[\"task1_step1_param1\"], \"2\":[\"task1_step2_param1\",\"task1_step2_param2\"]}"],
"2": ["task2_step2_param1", "task2_step2_param2", "23"],
"4": ["task2_step4_param1", "42", "task2_step4_param3", "task2_step4_param4"],
"timeout" : 12000
}
"""
```

[<< Calling Scenarios](/docs/callingScenarios.md) ________________ [Gherkin Variables >>](/docs/gherkinVariables.md)