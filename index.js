(function (module) {

    var _ = require('underscore');
    var _parser = require('./Parser');

    // internal words storage
    var _parts = {};

    // should we ignore the case of the text?
    var _ignoreCase = true;

    var _documents = {};

    module.index= function (id, text, document) {

        // attempt to delete any existing document
        this.delete(id);

        if (_ignoreCase)
            text = text.toLowerCase();

        var parser = _parser.newParser(text);

        // split the input text into parts
        var parts = parser.split();

        var words = [];

        parts.forEach(function (item) {

            if (_parts[item] == null)
                _parts[item] = {
                    documents: []
                };

            if (_.indexOf(words, item) == -1)
                words.push(item);

            if (_.indexOf(_parts[item].documents, id) === -1)
                _parts[item].documents.push(id);
        });

        _documents[id]= {
            /*text: text,*/
            words: words,
            doc: document
        };
    }

    module.delete = function (id) {

        if (_documents[id] == null)
            return;

        // get the document
        var doc = _documents[id];

        doc.words.forEach(function (item) {

            if (_parts[item] == null)
                return;

            if (_.indexOf(_parts[item].documents, id) !== -1) {

                _parts[item].documents = _.without(
                    _parts[item].documents,
                    _.findWhere(_parts[item].documents, id));
            }
        });

        // remove from the object
        delete _documents[id];
    }

    module.execOperatorNode = function (node) {

        var left = this.execNode(node.left);
        var right = [];

        // do we need to calculate right?
        if (left.length > 0 || node.value == "or")
            right = this.execNode(node.right);

        switch  (node.value) {
            case "or":
                return _.union(left, right);

            case "and":
                return _.intersection(left, right);
        }
    }

    module.execNode = function (node) {

        switch  (node.type) {
            case "word":

                // get the part
                var part = this.lookup(node.value);

                // make sure we have a result
                if (part == null)
                    return [];

                return _.clone(part.documents);

            case "operator":
                return this.execOperatorNode(node);

            case "group":
                return this.execNode(node.exp);

            default :
                return [];
        }
    }

    module.search = function(text, sortBy) {

        if (_ignoreCase)
            text = text.toLowerCase();

        // create the parser & parse
        var parser =_parser.newParser(text);

        var ats = parser.parse(text);

        // exec the top level node
        var docs= this.execNode(ats);

        var ret = [];

        _.forEach(docs, function (val, index) {

            var doc = _documents[val];

            ret.push({
                id: val,
                doc: doc.doc
            });
        })

        if (sortBy) {
            ret = _.sortBy(ret, sortBy);
        }

        return ret;
    }

    module.lookup = function (part) {

        if (_parts == null)
            return null;

        return _parts[part];
    }

    module.setIgnoreCase = function (ignore) {
        _ignoreCase = ignore;
    }

    module.count = function () {
        return _.size(_documents);
    }

    module.clear = function () {
        _parts = {};
        _documents= {};
    }

})(module.exports);