const fs = require('fs');
const path = require('path');

function runTask(task) {
    try {
        const curTask = require(path.join('./tasks', task));
        curTask.run();
    } catch(e) {
        console.log(`run task: ${task} err: ${e}`);
    }
};

function main() {
    let tasks = [];
    if (process.env.SINGLE_TASK == '1') {
        if (process.argv.length < 3 || !process.argv[2]) {
            console.log('you are run in single-task mode and no task provided');
            return;
        }
        tasks.push(process.argv[2]);
    } else if (fs.exists('./localConfig.json')) {
        const localConfig = require('./localConfig.json');
        if (localConfig.tasks) {
            tasks = localConfig.tasks;
        }
    }

    if (!tasks || !tasks.length) {
        console.log('no task to run');
        return;
    }

    for (task of tasks) {
        runTask(task);   
    }
}

main();