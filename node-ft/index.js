(function (module) {

    var _delimiter = new RegExp("[ ]+");

    // internal words storage
    var _parts = {};

    // should we ignore the case of the text?
    var _ignoreCase = false;
    
    module.index= function (id, text) {

        var parts = module.splitText(text);

        parts.forEach(function (item) {

            if (_parts[item] == null)
                _parts[item] = {
                    documents: []
                };

            if (_parts[item].documents.indexOf(id) === -1)
                _parts[item].documents.push(id);
        });
    }

    module.search = function(text) {

        var _ = require('underscore');

        // get the parts
        var parts = module.splitText(text);

        var ids = [];

        _.each(parts, function(lookup, index) {

            // get the part
            var part = module.lookup(lookup);

            // make sure we have a result
            if (part == null)
                return;

            if (index == 0)
                ids = _.clone(part.documents);
            else {
                ids = _.intersection(ids, part.documents);
            }
        });

        return ids;
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
        return 1;
    }

    module.setDelimiter = function(delimiter) {

        var params = Array.prototype.join.call(arguments, "");

        if (params.length == 0)
            params = " ";

        var regexString = "[" + params + "]+";

        // create the regex object
        _delimiter = new RegExp(regexString);
    };

    module.splitText= function (text) {

        if (_ignoreCase)
            text = text.toLowerCase();

        var result = [];

        // split the values
        var parts= text.split(_delimiter);

        // remove the duplicates
        parts.forEach(function (part) {

            if (result.indexOf(part) != -1)
                return;

            result.push(part);
        })

        return result;
    };

})(module.exports);