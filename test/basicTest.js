var expect = require("chai").expect;
var _ = require('underscore');

var newEngine = function () {

    var nodeFT = require('../');

    return nodeFT();
}

describe("basic", function() {
    describe("create node ft engine", function() {
        it("should return an instance of the NodeFT engine", function(){

            var ftEngine = newEngine();

            expect(ftEngine).not.to.be.null;
        });
    });

    describe("index a basic document", function() {

        it("should accept some text to index and check document count", function(){

            var ftEngine = newEngine();

            ftEngine.index('1', 'this is some text to index');
            ftEngine.index('2', 'this is some text to index');

            // we should have one document in the system
            expect(ftEngine.count()).to.equal(2);
        });

        it("it should index the text and store a reference to the document ID internally", function(){

            var ftEngine = newEngine();

            ftEngine.clear();

            ftEngine.index('1', 'this is some text to index');

            // we should have one document in the system
            var lookup = ftEngine.lookup('this');

            expect(lookup.documents[0]).to.equal('1');
        });
    });

    describe("misc functions on the search index", function() {

        it("should accept some text to index and check document count", function(){

            var ftEngine = newEngine();

            ftEngine.index('1', 'this is some text to index');
            ftEngine.index('2', 'this is some text to index');

            ftEngine.clear();

            // we should have one document in the system
            expect(ftEngine.count()).to.equal(0);
        });

        it("should overwrite an existing document", function(){

            var ftEngine = newEngine();

            ftEngine.index('1', 'this is some text to index');
            ftEngine.index('1', 'this is some text to index');

            // we should have one document in the system
            expect(ftEngine.count()).to.equal(1);
        });

        it("should delete a document from the index", function(){

            var ftEngine = newEngine();

            ftEngine.index('1', 'this is some text to index');
            ftEngine.delete('1');

            // we should have one document in the system
            expect(ftEngine.count()).to.equal(0);
        });
    });

    describe("test the search features of the index", function() {

        it ("search for a document matching a single word", function () {

            var ftIndex= newEngine();

            ftIndex.index('1', "this is some text");
            ftIndex.index('2', "this is some more text");

            var ids1 = ftIndex.search("this");
            expect(ids1.length).to.equal(2);

            var ids2 = ftIndex.search("more");
            expect(ids2.length).to.equal(1);
        });

        it ("search for a document matching two words", function () {

            var ftIndex= newEngine();

            ftIndex.index('1', "this is some text");
            ftIndex.index('2', "this is some more text");

            var ids2 = ftIndex.search("this more");
            expect(ids2.length).to.equal(1);
        });

        it ("confirm setIgnoreCase(true) works", function () {

            var ftIndex= newEngine();

            ftIndex.setIgnoreCase(true);
            ftIndex.index('1', "this is SOME text");
            ftIndex.index('2', "this is more text");

            var ids2 = ftIndex.search("Some");
            expect(ids2.length).to.equal(1);
        });

        it ("confirm setIgnoreCase(false) works", function () {

            var ftIndex= newEngine();

            ftIndex.setIgnoreCase(false);
            ftIndex.index('1', "this is SOME text");
            ftIndex.index('2', "this is more text");

            var ids2 = ftIndex.search("Some");
            expect(ids2.length).to.equal(0);
        });
    });

    describe("Run more complex search expressions", function() {

        it ("should handle the or operator", function () {

            var ftIndex= newEngine();

            ftIndex.index('1', "one two");
            ftIndex.index('2', "three four");
            ftIndex.index('3', "five six");
            ftIndex.index('4', "seven eight");

            var ids2 = ftIndex.search("one or three");
            expect(ids2.length).to.equal(2);
        });

        it ("should group with an OR", function () {

            var ftIndex= newEngine();

            ftIndex.index('1', "one two");
            ftIndex.index('2', "three four");
            ftIndex.index('3', "five six");
            ftIndex.index('4', "seven eight");

            var ids2 = ftIndex.search("one or (three and seven)");
            expect(ids2.length).to.equal(1);
        });

        it ("should handle and with a group and or", function () {

            var ftIndex= newEngine();

            ftIndex.index('1', "one two");
            ftIndex.index('2', "three four");
            ftIndex.index('3', "five six");
            ftIndex.index('4', "one eight");

            var ids2 = ftIndex.search("one and (two or eight)");
            expect(ids2.length).to.equal(2);
        });

        it ("should process an OR expression", function () {
            var ftIndex= newEngine();

            ftIndex.index('1', "one two three");
            ftIndex.index('2', "four five six");
            ftIndex.index('3', "seven eight three");

            var ids2 = ftIndex.search("one or three");
            expect(ids2.length).to.equal(2);
        })
    });

    describe("Store documents in the index", function() {

        it("return documents from the serach call", function () {

            var ftIndex = newEngine();

            var docs = [
                {
                    id: '1',
                    text: 'one two'
                },
                {
                    id: '2',
                    text: 'three four'
                },
                {
                    id: '3',
                    text: 'five six'
                },
                {
                    id: '4',
                    text: 'seven eight'
                }
            ];

            _.forEach(docs, function (val) {
                ftIndex.index(val.id, val.text, val);
            });

            var ids2 = ftIndex.search("one or three");
            expect(ids2.length).to.equal(2);

            expect(ids2[0].doc.text).to.equal("one two");
            expect(ids2[0].doc.id).to.equal('1');
        });
    });

    describe("Sort documents on return from search", function() {

        it("Search the documents by text", function () {

            var ftIndex = newEngine();

            var docs = [
                {
                    id: '1',
                    sort: 4,
                    text: 'one two'
                },
                {
                    id: '2',
                    sort: 3,
                    text: 'three four'
                },
                {
                    id: '3',
                    sort: 77,
                    text: 'five six'
                },
                {
                    id: '4',
                    sort: 1,
                    text: 'seven eight'
                }
            ];

            _.forEach(docs, function (val) {
                ftIndex.index(val.id, val.text, val);
            });

            var ids2 = ftIndex.search("one or three or seven", function (result) {
                return result.doc.sort;
            });

            expect(ids2.length).to.equal(3);

            expect(ids2[0].doc.text).to.equal("seven eight");
            expect(ids2[0].doc.id).to.equal('4');
        });
    });

    describe("node-ft.InputStream", function() {

        /*
         inputStream should implement

         - next()
         - peek()
         - eof()
         - croak(msg)

         */

        it("creates a stream with text data and returns eof() == false", function(){

            var stream = require('../Parser').newInputStream("this is some text");

            expect(stream.eof()).to.be.equal(false);
        });

        it ("should init with a stream and peek the next char", function () {

            var stream = require('../Parser').newInputStream("this is some text");

            expect(stream.peek()).to.equal('t');
        });

        it("should init with a stream and return the next char", function () {

            var stream = require('../Parser').newInputStream("this is some text");

            expect(stream.next()).to.equal('t');
            expect(stream.next()).to.equal('h');
            expect(stream.next()).to.equal('i');
            expect(stream.next()).to.equal('s');
        })

        it("should return eof when we hit the end", function () {

            var stream = require('../Parser').newInputStream("this");

            expect(stream.next()).to.equal('t');
            expect(stream.next()).to.equal('h');
            expect(stream.next()).to.equal('i');
            expect(stream.next()).to.equal('s');

            expect(stream.eof()).to.be.equal(true);
        })

        it("col should increment with position", function () {

            var stream = require('../Parser').newInputStream("this is some text");

            stream.next();
            stream.next();

            expect(stream.col()).to.equal(2);
        })

        it("col should increment with position after new line", function () {

            var stream = require('../Parser').newInputStream("ok\nok\n");

            // o
            stream.next();
            expect(stream.col()).to.equal(1);
            expect(stream.line()).to.equal(0);

            // k
            stream.next();
            expect(stream.col()).to.equal(2);
            expect(stream.line()).to.equal(0);

            // \n
            stream.next();
            expect(stream.col()).to.equal(0);
            expect(stream.line()).to.equal(1);

            // o
            stream.next();
            expect(stream.col()).to.equal(1);
            expect(stream.line()).to.equal(1);

            // k
            stream.next();
            expect(stream.col()).to.equal(2);
            expect(stream.line()).to.equal(1);

            // \n
            stream.next();
            expect(stream.col()).to.equal(0);
            expect(stream.line()).to.equal(2);

            // eof
            stream.next();
            expect(stream.eof()).to.be.equal(true);
        })
    });

    describe("node-ft.Tokenizer", function() {

        it("should correctly detect brackets", function () {

            var tokenizer = require('../Parser').newTokenizer();
            expect(tokenizer.isBrackets("(")).to.equal(true);
            expect(tokenizer.isBrackets(")")).to.equal(true);
            expect(tokenizer.isBrackets("d")).to.equal(false);
        });

        it("should correctly read whitespace chars", function () {

            var tokenizer = require('../Parser').newTokenizer();
            expect(tokenizer.isWhitespace(" ")).to.equal(true);
            expect(tokenizer.isWhitespace("\t")).to.equal(true);
            expect(tokenizer.isWhitespace("\n")).to.equal(true);
        });

        it("should correctly detect isOperator", function () {

            var tokenizer = require('../Parser').newTokenizer();
            expect(tokenizer.isOperator("or")).to.equal(true);
            expect(tokenizer.isOperator("and")).to.equal(true);
            expect(tokenizer.isOperator("nokw")).to.equal(false);
        });

        it("should correctly detect isAlphaNumericWord", function () {

            var tokenizer = require('../Parser').newTokenizer();
            expect(tokenizer.isAlphaNumeric("a")).to.equal(true);
            expect(tokenizer.isAlphaNumeric("b")).to.equal(true);
            expect(tokenizer.isAlphaNumeric("=")).to.equal(false);
        });

        it("should read some brackets", function () {

            var tokenizer = require('../Parser').newTokenizer("(");

            var token = tokenizer.next();

            expect(token.type).to.equal("brackets");
            expect(token.value).to.equal("(");

            expect(tokenizer.eof()).to.equal(true);
        });

        it("should read an alpha numeric token", function () {

            var tokenizer = require('../Parser').newTokenizer("abcde");

            var token = tokenizer.next();

            expect(token.type).to.equal("word");
            expect(token.value).to.equal("abcde");

            expect(tokenizer.eof()).to.equal(true);
        });

        it("should read an operator", function () {

            var tokenizer = require('../Parser').newTokenizer("or");

            var token = tokenizer.next();

            expect(token.type).to.equal("operator");
            expect(token.value).to.equal("or");

            expect(tokenizer.eof()).to.equal(true);
        });

        it("should read an operator in upper case", function () {

            var tokenizer = require('../Parser').newTokenizer("OR");

            var token = tokenizer.next();

            expect(token.type).to.equal("operator");
            expect(token.value).to.equal("or");

            expect(tokenizer.eof()).to.equal(true);
        });

        it("should read an operator (with peek)", function () {

            var tokenizer = require('../Parser').newTokenizer("or");

            var token = tokenizer.peek();

            expect(token.type).to.equal("operator");
            expect(token.value).to.equal("or");

            expect(tokenizer.eof()).to.equal(false);

            tokenizer.next();
            expect(tokenizer.eof()).to.equal(true);
        });

        it("should read and hit eof()", function () {

            var tokenizer = require('../Parser').newTokenizer("or this and that");

            expect(tokenizer.eof()).to.equal(false);

            tokenizer.next();
            tokenizer.next();
            tokenizer.next();
            tokenizer.next();

            expect(tokenizer.eof()).to.equal(true);
        });

        it("ignore non whitespace/token chars", function () {

            var tokenizer = require('../Parser').newTokenizer("@or = 'this");

            expect(tokenizer.eof()).to.equal(false);

            expect(tokenizer.next().value).to.equal("or");
            expect(tokenizer.next().value).to.equal("this");

            expect(tokenizer.eof()).to.equal(true);
        });
    });

    describe("node-ft.Parser", function() {

        it ("parse a simple two word expression", function () {

            var parser = require('../Parser').newParser("this that");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("and");
        });

        it ("parse a one word expression", function () {

            var parser = require('../Parser').newParser("this");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("word");
            expect(ast.value).to.equal("this");
        });

        it ("should parse a three word expression", function () {

            var parser = require('../Parser').newParser("this we that");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("and");
        });

        it ("parse a simple group", function () {

            var parser = require('../Parser').newParser("(this that three) (another)");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("and");

            expect(ast.left.type).to.equal("group");
            expect(ast.right.type).to.equal("group");
        });

        it ("parse a simple or", function () {

            var parser = require('../Parser').newParser("this or that");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("or");

            expect(ast.left.type).to.equal("word");
            expect(ast.left.value).to.equal("this");
        });

        it ("multiple groups", function () {

            var parser = require('../Parser').newParser("(this) (that)");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("and");

            expect(ast.left.type).to.equal("group");
            expect(ast.left.exp.type).to.equal("word");
        });

        it ("multiple groups with OR", function () {

            var parser = require('../Parser').newParser("(this) or (that)");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("or");

            expect(ast.left.type).to.equal("group");
            expect(ast.left.exp.type).to.equal("word");
        });

        it ("multiple OR (this or or that)", function () {

            var parser = require('../Parser').newParser("this or or or that");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("or");

            expect(ast.right.type).to.equal("word");
            expect(ast.right.value).to.equal("that");

        });

        it ("operator with no right ('this or')", function () {

            var parser = require('../Parser').newParser("this or");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("word");
            expect(ast.value).to.equal("this");
        });

        it ("operator with no left ('or this')", function () {

            var parser = require('../Parser').newParser("or or this");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("word");
            expect(ast.value).to.equal("this");
        });

        it ("operator with no left (nested in sub-group) 'this (or that)'", function () {

            var parser = require('../Parser').newParser("this (or that)");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("and");

            // top level token should be or
            expect(ast.left.type).to.equal("word");
            expect(ast.left.value).to.equal("this");

            // top level token should be or
            expect(ast.right.type).to.equal("group");
            expect(ast.right.exp.type).to.equal("word");
            expect(ast.right.exp.value).to.equal("that");
        });

        it ("quotes should be ignored or treated as separators?", function () {

            var parser = require('../Parser').newParser("you're=d");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("and");
            expect(ast.left.value).to.equal("you");
            expect(ast.right.type).to.equal("operator");
        });

        it ("more complex expression with multiple and´s and subgroups", function () {

            var parser = require('../Parser').newParser("this or (one and (three or four or five))");

            var ast = parser.parse();

            // top level token should be or
            expect(ast.type).to.equal("operator");
            expect(ast.value).to.equal("or");
            expect(ast.left.value).to.equal("this");
            expect(ast.right.type).to.equal("group");
        });

        it ("Split some text into words for indexing", function () {

            var parser = require('../Parser').newParser("this,is some text that's good");

            var words = parser.split();

            // top level token should be or
            expect(words.length).to.equal(7);
        });
    });
});