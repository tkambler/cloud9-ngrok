'use strict';

const program = require('commander');
const spawn = require('child_process').spawn;
const ngrok = require('ngrok');

program
    .version('1.0.0')
    .option('-a, --auth [username:password]', 'Authentication')
    .option('-c, --collab', 'If passed, run Cloud9 in "collaborative" mode.')
    .option('-n, --ngrok', 'If passed, create an ngrok tunnel pointing to your Cloud9 environment')
    .parse(process.argv);

let cloud9Proc;
let ngrokProc;
let username;
let password;

if (program.auth) {
    let tmp = program.auth.split(':');
    if (tmp.length !== 2 || tmp[0] === '' || tmp[1] === '') {
        throw new Error(`Both username and password are required (e.g. --auth user:pass)`);
    } else {
        username = tmp[0];
        password = tmp[1];
    }
}

function shutdown(err) {

    if (err) {
        console.log(err.toString());
    }

    ngrok.disconnect();

    if (cloud9Proc) {
        cloud9Proc.kill();
    }

    process.exit();

}

const c9args = [
    '/cloud9/server.js',
    '--listen',
    '0.0.0.0',
    '--port',
    '80',
    '-w',
    '/workspace',
    '-b'
];

if (username && password) {
    c9args.splice(c9args.length, 0, `-a ${username}:${password}`);
}

if (program.collab) {
    c9args.splice(c9args.length, 0, '--collab');
}

cloud9Proc = spawn('node', c9args, {
    'cwd': '/root',
    'shell': true,
    'env': process.env
});

cloud9Proc.stdout.on('data', (data) => {
//     console.log(data.toString('utf8'));
});

cloud9Proc.stderr.on('data', (data) => {
//     console.log(data.toString('utf8'));
});

cloud9Proc.on('close', (code) => {
    cloud9Proc = null;
    shutdown();
});

console.log(`Cloud9 server is now up and running.`);

if (program.ngrok) {

    if (!program.auth || !username || !password) {
        throw new Error(`When a ngrok tunnel is requested, a username and password must be specified (e.g. --auth user:pass).`);
    }

    ngrok.connect({
        'proto': 'http',
        'addr': '80',
        'region': 'us'
    }, (err, url) => {

        if (err) {
            throw err;
            shutdown(err);
        }

        console.log('ngrok tunnel is available at: ' + url);

    });

}

process.on('SIGINT', (e) => {
    shutdown();
});
