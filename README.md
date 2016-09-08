# StacheR(ead)

A simple NodeJS lib to query items stored in Stache

## Usage

```javascript
var StacheR = require('./index');
var myStache = new StacheR({},{});

var item = 11534;
var key = 'a0297d708e12b0dc38e62f169bc11229794eb57c95c6567c634958f9498ff70d';
myStache.get(item, key, (error, response) => {
  if (error) {
    console.error({ error: error });
  }

  if (response) {
    console.log("Success:");
    console.log({ response: response });
  }

});
```

