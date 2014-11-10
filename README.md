Full-Text Search engine for NodeJS
=======

Node-FT adds basic in-memory Full-Text search capabilities to NodeJS

=======
Basic Usage

```javascript
var ftIndex= require('./node-ft');

ftIndex.index('1', "this is some text");
ftIndex.index('2', "this is some more text");

var documentIds = ftIndex.search("this");
```

Document storage

```javascript

ftIndex.index('1', "this is some text", 
{ 
    value: 12,
    some: 'this is a doc' 
});

var documentIds = ftIndex.search("this");

console.log(documentIds[0].doc.value);

```

Sort Results

```javascript

var documentIds = ftIndex.search("this", function(result) {
    return result.doc.sort;
});
```

Delete Document

```javascript

ftIndex.delete('2');

```

OR expressions

```javascript

var documentIds = ftIndex.search("this or that", function(result) {
    return result.doc.sort;
});

```

Nested Expressions

```javascript

var documentIds = ftIndex.search("this or (that and other)", function(result) {
    return result.doc.sort;
});

```

