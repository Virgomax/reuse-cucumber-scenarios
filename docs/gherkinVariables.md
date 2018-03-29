## Gherkin Variables: How do you set a variable?

In order to help to reuse cucumber scenarios, let's introduce gherkin variables(only supported with reuse-cucumber-scenarios package).

The two step patterns related to Gherkin variables are:

```gherkin
Given the variable "$variable_name" is equal to "value"
```

```gherkin
Given the variable "$variable_name" is equal to
"""
#JSON object
"""
```
Where:
   `$variable_name` is a variable that you define and remains across scenarios and `.feature` files.

To define a gherkin variable, you have to start with the symbol `$`. For example: `$my_first_GherkinVariable`

### Examples

```gherkin
@set_totalUsers
Scenario: Set the variable $totalUsers
Given the variable "$totalUsers" is equal to "3"
```

You can use assig a JSON object to a variable as follows:

```gherkin
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
```

