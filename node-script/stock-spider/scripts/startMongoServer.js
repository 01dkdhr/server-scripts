const exec = require('child_process').exec;
const localConfig = require('../local-config.json');

if (localConfig && localConfig['mongo-db-path']) {
    var cmd = `mongod --dbpath=${localConfig['mongo-db-path']}`;

    exec(cmd, function(error, stdout, stderr) {
        error && console.log('err:', error);
    });
} else {
    console.log('err: not find mongodb config')
}

