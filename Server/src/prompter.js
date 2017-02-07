
"use strict"

import colors from 'colors';
import readline from 'readline';
import util from 'util';

module.exports = (app) => {



    // command line before cmd
    app.title = app.title || colors.grey('$socket');




    const clear = () => {
        process.stdout.write("\x1Bc");
    };

    const fu = (type, args) => {
        var t = Math.ceil((rl.line.length + 3) / process.stdout.columns);
        var text = util.format.apply(console, args);
        rl.output.write("\n\x1B[" + t + "A\x1B[0J");
        rl.output.write(text + "\n");
        rl.output.write(new Array(t).join("\n\x1B[E"));
        rl._refreshLine();
    };

    const completer = (line) => {
        var completions = [
            ''
        ];

         var hits = completions.filter((c) => {
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

    rl.on("line", (line) => {

        app.query(line);

        rl.prompt();
    });
    rl.on('close', () => {
        return process.exit(0);
    });
    rl.on("SIGINT", () => {
        rl.clearLine();
        return process.exit(0);
    });



    console.log = () => {
        fu("log", arguments);
    };
    console.warn = () => {
        fu("warn", arguments);
    };
    console.info = () => {
        fu("info", arguments);
    };
    console.error = () => {
        fu("error", arguments);
    };

    clear();
    rl.setPrompt(app.title+colors.green(' > '), 2);
    rl.prompt();
};
