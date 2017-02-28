import child_process from 'child_process';

const env = process.argv[2] || 'PROD';
console.log(env);

let childprocess = createChild();

process.on('SIGINT', () => {
    if(childprocess && childprocess.kill) {
        createChild = null;
        childprocess.kill(0);
    }
});

function createChild() {
    let child = child_process.spawn('node', ['./dist/server.js', env]);
    child.stdout.on('data', function (data) {
        console.log(data.toString());
    });

    child.on('exit', function (code) {
        console.log('child process exited with code ' + code.toString());
        if(createChild) {
            child = createChild();
        }
    });

    return child;
}