Full-Text Search engine for NodeJS
=======

Node-FT adds basic in-memory Full-Text search capabilities to Node. Supporting:

- Document Indexing
- Results Sorting
- <strong>AND</strong> / <strong>OR</strong> Operations
- Nested Expresions: ```First and (whole or world or (another word))```

=======

Installation

```
npm install node-ft
```

=======
Basic Usage

```javascript
var nodeFT= require('node-ft');

var inx = nodeFT();

inx.index('1', "this is some text");
inx.index('2', "this is some more text");

var docs = inx.search("this");
```

Document storage

```javascript

inx.index('1', "this is some text",
{ 
    value: 12,
    some: 'this is a doc' 
});

var docs = inx.search("this");

console.log(docs[0].doc.value);

```

Sort Results

```javascript

var docs = inx.search("this", function(result) {
    return result.doc.sort;
});
```

Delete Document

```javascript

inx.delete('2');

```

OR expressions

```javascript

var docs = inx.search("this or that", function(result) {
    return result.doc.sort;
});

```

Nested Expressions

```javascript

var docs = inx.search("this or (that and other)", function(result) {
    return result.doc.sort;
});

```

Clear Index

```javascript

inx.clear();

```

Get Document Count

```javascript

var docCount = inx.count();

```

