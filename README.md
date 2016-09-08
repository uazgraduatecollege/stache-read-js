# StacheR(ead)

A simple NodeJS lib to query items stored in Stache

## Usage

```javascript
var StacheR = require('./index');
var myStache = new StacheR({
  domain: 'stache-server.my.edu',
  path: '/api/path/to/item/read/'
},
{
  userAgent: 'My StacheReader'
});

var item = 12345;
var key = 'a028e12b0dc38e62f169bc11229794eb57c95c6567c634958f9498ff70d97d70';
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

## Use of JSON within Stache(d) items

While the response body served by a successful stache request will be JSON,
it may also be useful to define one or more elements of the stached item as
JSON values. In such cases, given the return format from Stache and the way
Node's `JSON.parse()` work together, it's recommended to enclose both the
object keys and their values in double-quotes.

Eg: Given a Stached item with the following values:
* nickname: `Brian`
* purpose: `Romanes eunt domus`,
* secret: `{ "romansgaveus": "aqueducts, sanitation, roads, and education" }`,
* memo: `Always look on the bright side of life`

Where `secret` holds a string that can be parsed into JSON, it's best to
enclose both keys and string values in quotes.

Then, given a successful request

```javascript
response.parsedSecrets = JSON.parse(response.secret);
console.log(response);
```

will output

```javascript
{ nickname: 'Brian',
  purpose: 'Romanes eunt domus',
  secret: '{ "romansgaveus": "aqueducts, sanitation, roads, and education" }',
  memo: 'Always look on the bright side of life',
  parsedSecrets:
   { romansgaveus: 'aqueducts, sanitation, roads, and education' } }
```

