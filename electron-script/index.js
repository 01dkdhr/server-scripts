const path = require('path')
const fs = require('fs')
const { app } = require('electron');
const localConfig = require('./local-config.json');

function runTask(taskName) {
    try {
        console.log(`begin run task: ${taskName}`);
        const task = require(`./tasks/${taskName}/Task.js`);

        task.run()
        .then((result) => {
            console.log(`success run task: ${taskName}`);
            app.exit();
        })
        .catch((err) => {
            console.log(`failed run task: ${taskName}: ${err}`);
            app.exit();
        });

    } catch(err) {
        console.log(`run task ${taskName} err: ${err}`);
    }
}

function main() {
    if (!localConfig || !localConfig.tasks || !localConfig.tasks.length) {
        console.log('no task to run!');
        return;
    }

    localConfig.tasks.forEach((task) => {
        runTask(task);
    });
}

app.on('ready', () => {
    main();
});