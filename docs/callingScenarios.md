## Calling Scenarios: How do you call an scenario?

For a simple scenario call, you can use any of the following step patterns:

```gherkin
Given the scenario "@scenario_tag"
```

```gherkin
When the scenario "@scenario_tag" happens
```

In order to call a scenario you first have to defined and identify it with a unique tag. For example, let's define the scenario "@task1" and then call it from the scenario "@task2"

```gherkin
feature: my DRY feature 

   @task1
   Scenario: do some reusable task 
      Given some condition "condition_1"
      When the action "action_1" happens 5 times
      And the action "action_2" happens
      Then the result should be "result_1"

   @task2
   Scenario: execute a previous scenario and do some more steps
      Given the scenario "@task1"
      And the action "action_3" happens
      Then the result should be "result_2"
```

In this example, cucumber will execute the scenario "@task1" first, then it will go to the scenario "@task2" and since we are calling the scenario "@task1" in the first step, it will execute the scenario "@task1" again and then it will continue with the next steps. 

By default, the timeout of this composite step is the sum of the timeout of its step components (by default 5000 per step).

We have to highligth that for this to work, we need to place the scenario "@task1" before the scenario "@task2". If they are in separated `.feature` files, then the name of the file where "@task1" is located must be alphabetically before the name of the file where "@task2 is located.

[<< Defining Steps](/docs/definingSteps.md)________________[Step Parameters >>](/docs/stepParameters.md)

