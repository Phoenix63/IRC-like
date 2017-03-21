let exec = require('child_process').exec;

const colors = {
    Black:"\x1b[30m",
    Red:"\x1b[31m",
    Green:"\x1b[32m",
    Yellow:"\x1b[33m",
    Blue:"\x1b[34m",
    Purple:"\x1b[35m",
    Cyan:"\x1b[36m",
    White:"\x1b[37m",
    Default:"\x1b[39m",
    Gray: "\x1b[90m",
    lRed: "\x1b[91m",
    lGreen: "\x1b[92m",
    lYellow: "\x1b[93m",
    lBlue: "\x1b[94m",
    lMagenta: "\x1b[95m",
    lCyan: "\x1b[96m",
    clean: '\033[2J'
};

function getPercent(val) {
    val = val.toString();
    if(val.split('.')===1) {
        val += '.0';
    }
    if(val.length > 5) {
        val = val.split('.')[0]+'.'+val.split('.')[1][0];
    }
    while(val.length < 5)
        val = ' '+val;
    if(parseFloat(val) < 50) {
        val = colors.Green+val+colors.Default;
    } else if (val < 80) {
        val = colors.lYellow+val+colors.Default;
    } else {
        val = colors.Red+val+colors.Default;
    }
    return val+'%';
}

function getBar(val) {
    let bar = '';
    if(parseFloat(val) < 50) {
        bar = colors.lGreen;
    } else if (val < 80) {
        bar = colors.lYellow;
    } else {
        bar = colors.Red;
    }
    for(let i=0; i<val; i+=10) {
        bar += '|';
    }
    bar += colors.Gray;
    while((bar.match(/\|/g)||[]).length < 10) {
        bar += '|';
    }

    bar += colors.Default;
    return bar;
}


function execStats() {

    try {
        exec("ps -ef|grep 'pandirc:'|grep -v grep|awk {'print $2'}|head -2", (err, stdout, stderr) => {
            let lines = stdout.toString().split('\n');
            let pids = [];
            lines.forEach((line) => {
                if(line.trim() !== '') {
                    if(!isNaN(parseInt(line))) {
                        pids.push(line);
                    }
                }
            });
            let str = '';
            pids.forEach((pid) => {
                str += ' -p '+pid;
            });
            str += ' -o %cpu,%mem,cmd';

            exec('ps'+str+'|grep pandirc:', (err, stdout, sterr) => {
                let lines = stdout.toString().split('\n');
                let process = {};
                lines.map((line) => {
                    if(line.trim() !== '') {
                        let split = line.split(' ').filter((i) => (i !== ''));
                        process[split[2]] = {
                            cpu: parseFloat(split[0]),
                            ram: parseFloat(split[1])
                        };
                    }
                });
                let out = '';
                out += '\t-----------------------------------------------\n';
                out += '\t|             '+colors.lCyan+'Pand\'IRC Server'+colors.Default+'                 |\n';
                out += '\t|                                             |\n';
                out += '\t|  CPU usage: ['+getBar((process['pandirc:server']||{cpu:0}).cpu+(process['pandirc:master']||{cpu:0}).cpu)+']  '+getPercent((process['pandirc:server']||{cpu:0}).cpu+(process['pandirc:master']||{cpu:0}).cpu)+'            |\n';
                out += '\t|  MEM usage: ['+getBar((process['pandirc:server']||{ram:0}).ram+(process['pandirc:master']||{ram:0}).ram)+']  '+getPercent((process['pandirc:server']||{ram:0}).ram+(process['pandirc:master']||{ram:0}).ram)+'            |\n';
                out += '\t|                                             |\n';
                out += '\t-----------------------------------------------\n';
                out += '\t|                  Details                    |\n';
                out += '\t|  '+(process['pandirc:master']?colors.lCyan:colors.Red)+'---- pandirc:master'+colors.Default+'                        |\n';
                out += '\t|  CPU usage: ['+getBar((process['pandirc:master']||{cpu:0}).cpu)+']  '+getPercent((process['pandirc:master']||{cpu:0}).cpu)+'            |\n';
                out += '\t|  MEM usage: ['+getBar((process['pandirc:master']||{ram:0}).ram)+']  '+getPercent((process['pandirc:master']||{ram:0}).ram)+'            |\n';
                out += '\t|                                             |\n';
                out += '\t|  '+(process['pandirc:server']?colors.lCyan:colors.Red)+'---- pandirc:server'+colors.Default+'                        |\n';
                out += '\t|  CPU usage: ['+getBar((process['pandirc:server']||{cpu:0}).cpu)+']  '+getPercent((process['pandirc:server']||{cpu:0}).cpu)+'            |\n';
                out += '\t|  MEM usage: ['+getBar((process['pandirc:server']||{ram:0}).ram)+']  '+getPercent((process['pandirc:server']||{ram:0}).ram)+'            |\n';
                out += '\t|                                             |\n';
                out += '\t-----------------------------------------------\n';
                console.log(colors.clean);
                console.log(out);
            });
        });
    } catch (e) {
        console.log('['+colors.Red+'ERR'+colors.Default+'] Pandirc Server is not running...');
    }

}

if(process.env.LIVE) {
    execStats();
    setInterval(execStats, 500);
} else {
    execStats();
}

