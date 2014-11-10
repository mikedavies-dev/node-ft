var InputStream = function (input) {

    var _input = input;
    var _pos = 0;
    var _line = 0;
    var _col = 0;

    this.eof = function () {
        return this.peek() == "";
    }

    this.peek = function () {
        return _input.charAt(_pos);
    }

    this.next = function () {

        if (this.peek() == "\n") {
            _line++;
            _col = 0;
        } else {
            _col++;
        }

        return _input.charAt(_pos++);
    }

    this.die = function (msg) {
        throw new Error(msg + " (" + _line + ":" + _col + ")");
    }

    this.line = function () {
        return _line;
    }

    this.col = function () {
        return _col;
    }
};

var Tokenizer = function (input) {

    var _input = input;
    var _operators = " or and ";
    var _current = null;

    this.isBrackets = function(ch) {
        return "()".indexOf(ch) != -1;
    }

    this.isWhitespace = function (ch) {
        return " \t\n\r".indexOf(ch) != -1;
    }

    this.isOperator = function (kw) {
        return _operators.indexOf(" " + kw.toLowerCase() + " ") != -1;
    }

    this.isAlphaNumeric = function (ch) {
        return /[0-9a-z]/i.test(ch);
    }

    this.readWhitespace = function () {
        while (_input.eof() == false && this.isWhitespace(_input.peek()))
            _input.next();
    }

    this.readBrackets = function () {
        return {
            type: "brackets",
            value: _input.next()
        };
    }

    this.readWhile = function (callback) {
        var ret = "";

        while (callback(_input.peek()) && _input.eof() == false)
            ret+= _input.next();

        return ret;
    }

    this.readAlphaNumeric = function () {
        var word = this.readWhile(this.isAlphaNumeric);

        if (this.isOperator(word)) {
            return {
                type: "operator",
                value: word.toLowerCase()
            };
        }

        return {
            type: "word",
            value: word
        };
    }

    this.next = function () {

        if (_current != null) {
            var t = _current;
            _current = null;
            return t;
        }

        if (_input.eof())
            return null;

        // read all whitespace
        if (this.isWhitespace(_input.peek())) {
            this.readWhitespace();

            return this.next();
        }

        if (this.isBrackets(_input.peek()))
            return this.readBrackets();

        if (this.isAlphaNumeric(_input.peek()))
            return this.readAlphaNumeric();

        // ignore eveythign else
        _input.next();

        return this.next();
    }

    this.peek = function () {
        if (_current != null)
            return _current;

        _current= this.next();
        return _current;
    }

    this.eof = function () {
        return this.peek() == null;
    }
};

var Parser = function (input) {
    var _input = input;

    this.parse = function () {
        return this._parse(0);
    }

    this.split = function () {

        var ret = [];

        while (!_input.eof()) {

            var token = _input.next();

            switch (token.type) {
                case "word":
                    ret.push(token.value);
                    break;
            }
        }

        return ret;
    }

    this._parse = function (level) {

        if (_input.eof())
            return null;

        var token = _input.next();

        switch (token.type) {
            case "word":
                break;

            case "brackets":

                if (token.value == "(") {

                    var exp = this._parse(0);

                    token= {
                        type: "group",
                        exp: exp
                    };
                }
                else
                    return null;

                break;

            case "operator":
                // send it back so the default handler can deal with it.
                // that should avoid nested operators

                // if we are given an op change as first, ignore it
                if (level == 0)
                    return this._parse(0);

                return {
                    type: "opchange",
                    value: token.value
                };
        }

        if (!_input.eof()) {
            var right = this._parse(level + 1);

            if (right != null) {

                var operator = "and";

                // while loop adds support for multiple ops (this or or that)
                while (right.type == "opchange") {
                    operator = right.value;
                    right = this._parse(level + 1);

                    if (right == null)
                        break;
                }

                if (right != null) {
                    return {
                        type: "operator",
                        value: operator,
                        left: token,
                        right: right
                    };
                }
            }
        }

        return token;
    }
};

(function (module) {

    module.newInputStream = function (input) {
        return new InputStream(input);
    }

    module.newTokenizer = function (input) {

        var stream = module.newInputStream(input);

        return new Tokenizer(stream);
    }

    module.newParser = function (input) {
        var tokenizer = module.newTokenizer(input);

        return new Parser(tokenizer);
    }

})(module.exports);