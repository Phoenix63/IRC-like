/*
 *
 * IMPORTS
 */

var colors      = require('colors');
var readline    = require('readline');
var util        = require('util');

module.exports = function(app) {

    /*
     *
     * CONST
     */

    // command line before cmd
    app.title = app.title || colors.grey('$socket');




    const clear = function() {
        process.stdout.write("\x1Bc");
    };

    const fu = function (type, args) {
        var t = Math.ceil((rl.line.length + 3) / process.stdout.columns);
        var text = util.format.apply(console, args);
        rl.output.write("\n\x1B[" + t + "A\x1B[0J");
        rl.output.write(text + "\n");
        rl.output.write(new Array(t).join("\n\x1B[E"));
        rl._refreshLine();
    };

    const completer = function(line) {
        var completions = [
            ''
        ];

         var hits = completions.filter(function(c) {
             return c.indexOf(line) == 0;
         });

         if (hits.length > 0) {
             return [hits, line];
         }
         return [[], line];
    };
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer
    });
    /*
     *
     * Events
     */
    rl.on("line", function(line) {

        app.query(line);

        rl.prompt();
    });
    rl.on('close', function() {
        return process.exit(0);
    });
    rl.on("SIGINT", function() {
        rl.clearLine();
        return process.exit(0);
    });



    console.log = function() {
        fu("log", arguments);
    };
    console.warn = function() {
        fu("warn", arguments);
    };
    console.info = function() {
        fu("info", arguments);
    };
    console.error = function() {
        fu("error", arguments);
    };

    /*
     *
     * RUN
     */
    clear();
    rl.setPrompt(app.title+colors.green(' > '), 2);
    rl.prompt();
};

