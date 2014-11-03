Full-Text Search engine for NodeJS
=======

Node-FT adds basic in-memory Full-Text search capabilities to NodeJS

=======
Usage

```javascript
var ftIndex= require('./node-ft');

ftIndex.index('1', "this is some text");
ftIndex.index('2', "this is some more text");

var documentIds = ftIndex.search("this");
```
