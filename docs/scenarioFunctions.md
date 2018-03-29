## Scenario Functions: How do you define them?

In order to help to reuse cucumber scenarios, let's introduce scenario functions(only supported with reuse-cucumber-scenarios package).

The three step patterns related to scenario functions are:

```gherkin
Given the scenario "@$scenario_function_tag" where variable "$variable_name" is "value_to_replace"
```

```gherkin
Given the scenario "@$scenario_function_tag" where variables
"""
#JSON object containing variables and values for replacing.
"""
```

```gherkin
Given the scenario "@$scenario_function_tag" for variable "$variable_name" from "initial_integer" to "last_integer"
```

Where:
  `@$scenario_function_tag` is a unique tag that identifies a previous scenario function.
  `$variable_name` is a gherkin variable.
  `value_to_replace` is an integer defining the value to evaluate the scenario function. It is between quotes.
  `initial_integer` is an integer defining the first value to evaluate the scenario function. It is between quotes.
  `last_integer` is an integer defining the last value to evaluate the scenario function. It is between quotes.

To define a scenario function, you have to assign a unique tag starting with `@$`. For example: `@$my_first_scenarioFunction` this scenario will not be executed by its own, but it will be executed whenever is called by a step pattern shown before.

### Examples

```gherkin
#Setting some variables
  @set_totalUsers
  Scenario: Set the variable $totalUsers
  Given the variable "$totalUsers" is equal to "3"

  @set_usersDataList
  Scenario: Set the variable $usersDataList
  Given the variable "$usersDataList" is equal to
  """
  {
    "1":{
      "signupData":"user1_dataEntry1",
      "loginData":"user1_dataEntry2"
    },
    "2":{
      "signupData":"user2_dataEntry1",
      "loginData":"user2_dataEntry2"
    },
    "3":{
      "signupData":"user3_dataEntry1",
      "loginData":"user3_dataEntry2"
    }
  }
  """

#Defining the scenario function
  @$login
  Scenario: Login
      Given the user "$userId" is on "HomePage" page
      When the user "$userId" fills out "form2" using "$usersList[$userId].loginData"
      And the user "$userId" clicks on "submit"
      Then the user "$userId" should be redirected to "AssistantPage"

#Calling the scenario function with values to evaulate
  @login_multiple_users
    Scenario: Many people logs in
      Given there are "$numUsers" users
      And the scenario "@$login" for variable "$userId" from "1" to "$numUsers"
```

This example will use the necessary steps to login 3 users.

[<< Gherkin Variables](/docs/gherkinVariables.md)________________[INDEX >>](/README.md)