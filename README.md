Full-Text Search engine for NodeJS
=======

Node-FT adds basic in-memory Full-Text search capabilities to NodeJS

=======

Installation

```
npm install node-ft
```

=======
Basic Usage

```javascript
var ftIndex= require('node-ft');

ftIndex.index('1', "this is some text");
ftIndex.index('2', "this is some more text");

var docs = ftIndex.search("this");
```

Document storage

```javascript

ftIndex.index('1', "this is some text", 
{ 
    value: 12,
    some: 'this is a doc' 
});

var docs = ftIndex.search("this");

console.log(docs[0].doc.value);

```

Sort Results

```javascript

var docs = ftIndex.search("this", function(result) {
    return result.doc.sort;
});
```

Delete Document

```javascript

ftIndex.delete('2');

```

OR expressions

```javascript

var docs = ftIndex.search("this or that", function(result) {
    return result.doc.sort;
});

```

Nested Expressions

```javascript

var docs = ftIndex.search("this or (that and other)", function(result) {
    return result.doc.sort;
});

```

