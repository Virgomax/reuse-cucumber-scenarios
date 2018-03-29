## Enabling this package

Once you installed this package, you need to require it inside a `.steps.js` file and call it as a function:

```javascript
// randomFileName.steps.js
const enableScenarioCalling = require('reuse-cucumber-scenarios');
enableScenarioCalling();

//Here, you can add more traditional step definitions using the cucumber methods: When, Given, Then.
```

If you want "reuse-cucumber-scenarios" to show messages about it's execution, you can pass `true` as argument of the function:

```javascript
// randomFileName.steps.js
const enableScenarioCalling = require('reuse-cucumber-scenarios');
enableScenarioCalling(true);
```