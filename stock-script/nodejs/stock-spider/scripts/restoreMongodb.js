const path = require('path');
const exec = require('child_process').exec;
const localConfig = require('../local-config.json');

if (localConfig && !localConfig['is-server'] && localConfig['mongo-config'] && localConfig['mongo-config']['db-name']) {
    const dbName = localConfig['mongo-config']['db-name'];
    const from = path.join(__dirname, '../dump-mongodb');

    var cmd = `mongorestore -h 127.0.0.1 -d ${dbName} ${from}`;

    exec(cmd, function(error, stdout, stderr) {
        error && console.log('err:', error);
    });
} else {
    console.log('err: localConfig is err');
}