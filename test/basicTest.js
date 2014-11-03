var expect = require("chai").expect;

describe("basic", function() {
    describe("create node ft engine", function() {
        it("should return an instance of the NodeFT engine", function(){

            var ftEngine = require('../nodeft');

            expect(ftEngine).not.to.be.null;
        });
    });

    describe("index a basic document", function() {

        it("should accept some text to index and check document count", function(){

            var ftEngine = require('../nodeft');

            ftEngine.index('1', 'this is some text to index');

            // we should have one document in the system
            expect(ftEngine.count()).to.equal(1);
        });

        it("it should index the text and store a reference to the document ID internally", function(){

            var ftEngine = require('../nodeft');

            ftEngine.index('1', 'this is some text to index');

            // we should have one document in the system
            var lookup = ftEngine.lookup('this');

            expect(lookup.documents[0]).to.equal('1');
        });
    });



    describe("create a splitter object and perform some basic splitting", function() {

        it("should split some text into a basic array", function(){

            var splitter = require('../nodeft');

            splitter.setDelimiter();

            var words = splitter.splitText("this is some basic text");

            expect(words.length).to.equal(5);
        });

        it("should split override the default ' ' delimiter", function(){

            var splitter = require('../nodeft');

            // create some test text
            var textText = "this,is,some,basic,text";

            // split with default delimiter
            var words1 = splitter.splitText(textText);

            expect(words1.length).to.equal(1);

            // set the new delimiter
            splitter.setDelimiter(",");

            // split with new delimiter
            var words2 = splitter.splitText(textText);

            expect(words2.length).to.equal(5);
        });

        it("should process multiple delimiters", function(){

            var splitter = require('../nodeft');

            // create some test text
            var textText = "this is some basic text with you're";

            // set the new delimiter
            splitter.setDelimiter("\\s", "'");

            // split with new delimiter
            var words = splitter.splitText(textText);

            expect(words.length).to.equal(8);
        });

        it("should process multiple delimiters (more complex)", function(){

            var splitter = require('../nodeft');

            // create some test text
            var textText = "1,2'3,4'5,6";

            // set the new delimiter
            splitter.setDelimiter(",", "'");

            // split with new delimiter
            var words = splitter.splitText(textText);

            expect(words.length).to.equal(6);
        });

        it("should reset delimiter back to default", function(){

            var splitter = require('../nodeft');

            splitter.setDelimiter(",");

            var words = splitter.splitText("this,is,some");
            expect(words.length).to.equal(3);

            // set the delimiter back to default
            splitter.setDelimiter();

            var words = splitter.splitText("this is some");

            expect(words.length).to.equal(3);
        });

        it("should return all lower case if setIgnoreCase(true)", function(){

            var splitter = require('../nodeft');

            splitter.setDelimiter();
            splitter.setIgnoreCase(true);

            var words = splitter.splitText("this is SOME Basic text");

            expect(words.length).to.equal(5);
            expect(words[2]).to.equal("some");
        });

        it("should remove duplicates", function(){

            var splitter = require('../nodeft');

            splitter.setDelimiter();

            var words = splitter.splitText("this is some text this text has duplicates");

            expect(words.length).to.equal(6);

        });
    });

    describe("test the search features of the index", function() {

        it ("should return a document ID when indexed and searched with one word search", function () {

            var ftIndex= require('../nodeft');

            ftIndex.index('1', "this is some text");
            ftIndex.index('2', "this is some more text");

            var ids1 = ftIndex.search("this");
            expect(ids1.length).to.equal(2);

            var ids2 = ftIndex.search("more");
            expect(ids2.length).to.equal(1);
        });

        it ("should return a document ID when indexed and searched with two word search", function () {

            var ftIndex= require('../nodeft');

            ftIndex.index('1', "this is some text");
            ftIndex.index('2', "this is some more text");

            var ids2 = ftIndex.search("this more");
            expect(ids2.length).to.equal(1);
        });
    });
});