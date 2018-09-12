const { app } = require('electron');
const localConfig = require('./local-config.json');
const _ = require('lodash');

let taskArray = [];
function finishTask(task) {
    const index = _.findIndex(taskArray, task);
    if (index >= 0) {
        taskArray.splice(index, 1);
    }

    if (!index.length) {
        app.exit();
    }
}

function runTask(taskName) {
    try {
        console.log(`begin run task: ${taskName}`);
        const task = require(`./tasks/${taskName}/Task.js`);

        task.run()
        .then((result) => {
            console.log(`success run task: ${taskName}`);
            finishTask(taskName);
        })
        .catch((err) => {
            throw err;
        });
    } catch(err) {
        console.log(`failed run task: ${taskName}: ${err}`);
        finishTask(taskName);
    }
}

function main() {
    if (!localConfig || !localConfig.tasks || !localConfig.tasks.length) {
        console.log('no task to run!');
        return;
    }

    taskArray = localConfig.tasks;
    taskArray.forEach((task) => {
        runTask(task);
    });
}

app.on('ready', () => {
    main();
});