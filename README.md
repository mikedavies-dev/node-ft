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
var ftIndex= require('./node-ft');

ftIndex.index('1', "this is some text", { some: 'this is a doc' });
ftIndex.index('2', "this is some more text", { some: 'this is a doc' });

var documentIds = ftIndex.search("this");
```

Sort Results

```javascript
var ftIndex= require('./node-ft');

ftIndex.index('1', "this is some text", { some: 'this is a doc', sort: 9 });
ftIndex.index('2', "this is some more text", { some: 'this is a doc', sort: 8 });

var documentIds = ftIndex.search("this", function(result) {
    return result.doc.sort;
});
```

Delete Document

```javascript
var ftIndex= require('./node-ft');

ftIndex.index('1', "this is some text");
ftIndex.index('2', "this is some more text");

ftIndex.delete('2');

```