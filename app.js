(function () {

    var _ = require('underscore');
    var readLine = require('readline-sync');
    var S = require('string');

    var input = "";

    // create the FT engine
    var engine = require("./");

    while (input != "exit") {

        // get the input from the user
        input = readLine.question("# ");

        var command = S(input).parseCSV(' ', "'");

        if (command.length == 0)
            continue;

        switch (command[0].toLowerCase())
        {
            case "index":

                if (command.length < 3) {
                    console.log("example: \n  index 'docId' 'document text'");
                    continue;
                }

                // index the document
                engine.index(
                    command[1],
                    command[2]
                );

                break;

            case "search":

                if (command.length < 2) {
                    console.log("example: \n  search 'document text'");
                    continue;
                }

                var ids = engine.search(command[1]);

                _.each(ids, function (id) {
                    console.log("docId: " + JSON.stringify(id));
                })

                break;

            case "delete":

                if (command.length < 2) {
                    console.log("example: \n  remove 'docId'");
                    continue;
                }

                engine.delete(command[1]);
                break;


            case "clear":
                break;

            default:
                console.log("Invalid command");
                break;
        }
    }

})(module.exports);