var colors      = require('colors');
var readline    = require('readline');
var util        = require('util');

module.exports = function(app) {

    //clear cmd
    const clearCmd = function() {
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
        var completions = ["/w", "/clients", "/kick", "/bc"];
        var hits = completions.filter(function(c) {
            return c.indexOf(line) == 0;
        });

        if (hits.length == 1) {
            return [hits, line];
        } else {
            console.log("Suggest :");
            var list = "",
                l = 0,
                c = "",
                t = hits.length ? hits : completions;
            for (var i = 0; i < t.length; i++) {
                c = t[i].replace(/(\s*)$/g, "")
                if (list != "") {
                    list += ", ";
                }
                if (((list + c).length + 4 - l) > process.stdout.columns) {
                    list += "\n";
                    l = list.length;
                }
                list += c;
            }
            console.log(list + "\n");
            return [hits, line];
        }
    };
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: completer
    });



    //Events

    //The 'line' event is emitted whenever the input stream receives an end-of-line input (\n, \r, or \r\n)
    rl.on("line", function(line) {
        app.query(line);
       // rl.prompt();
    });
    rl.on('close', function() {
        return process.exit(1);
    });

    /* no very useless but interesting
    rl.on('SIGINT', function() {
        rl.question('Are you sure you want to exit?(y/no)', function(answer) {
            return (answer.match(/^o(ui)?$/i) || answer.match(/^y(es)?$/i)) ? process.exit(1) : rl.prompt();
        });
    });*/


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

    //Run
    clearCmd();
    //change C:\blablabla to $socket>
    rl.setPrompt(colors.grey('$socket ')+colors.green('> '), 2);
    rl.prompt();
};

