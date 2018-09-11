const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;
const localConfig = require('../local-config.json');
const TimeUtil = require('../utils/TimeUtil.js');

if (localConfig && localConfig['mongo-config'] && localConfig['mongo-config']['db-name']) {
    const host = localConfig['mongo-config']['host'];
    const dbName = localConfig['mongo-config']['db-name'];
    const user = localConfig['mongo-config']['user'];
    const password = localConfig['mongo-config']['password'];
    const output = path.join(__dirname, '../dump-mongodb');

    var cmd = `mongodump -h ${host} -d ${dbName} -u ${user} -p ${password} -o ${output}`;

    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            console.log('err:', error);
        } else {
            fs.readdir(output, (err, files) => {
                if (err) {
                    return;
                }

                files.forEach((file) => {
                    if (file.includes('.txt')) {
                        const fullPath = path.join(output, file);
                        if (fs.existsSync(fullPath)) {
                            fs.unlinkSync(fullPath);
                        }
                    }
                });

                const dateStr = TimeUtil.formatDate(new Date(), true);
                fs.writeFileSync(path.join(output, `${dateStr.replace(/ /g, '_').replace(/:/g, '-')}.txt`), '1');
            });
        }
    });
} else {
    console.log('err: localConfig is err');
}