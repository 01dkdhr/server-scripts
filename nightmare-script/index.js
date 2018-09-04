const fs = require('fs');
const path = require('path');
const program = require('commander');

function runTask(task) {
    try {
        const curTask = require(path.join('./tasks', task));
        curTask.run();
    } catch(e) {
        console.log(`run task: ${task} err: ${e}`);
    }
};

function main() {
    program
        .version('1.0.0')
        .option('-t, --task', 'run the task')
        .parse(process.argv);

    let tasks = [];

    if (program.task) {
        tasks.push(task);
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

    tasks.foreach((task) => {
        runTask(task);
    });
}

main();