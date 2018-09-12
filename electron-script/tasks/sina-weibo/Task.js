const path = require('path');
const BaseTask = require('../BaseTask.js');
const localConfig = require('./local-config.json');
const EncryptUtil = require('../../utils/EncryptUtil.js');

const taskName = 'sina-weibo';

class Task extends BaseTask {
    init() {
        const accessConfig = localConfig.access;
        const key = accessConfig.key;
        this.access = {
            user: EncryptUtil.decrypt(key, accessConfig.user),
            password: EncryptUtil.decrypt(key, accessConfig.password)
        }

        // 数据格式为 
        // {
        //     name: '',
        //     urlReg: /abc/g,
        //     timer: null
        // }
        this.switchPageTask = null;

        this.pageLoaded = false;
    }

    getConfig() {
        return {
            taskName: taskName,
            url: 'https://weibo.com/',
            preload: path.join(__dirname, './preload.js')
        }
    }

    startSwitchPageTask(task) {
        if (task) {
            this.switchPageTask = task;
            if (typeof this.switchPageTask.urlReg == 'string') {
                this.switchPageTask.urlReg = new RegExp(this.switchPageTask.urlReg);
            }
            
            this.switchPageTask.timer = setTimeout(() => {
                if (this.switchPageTask && this.switchPageTask.timer) {
                    clearTimeout(this.switchPageTask.timer);
                    this.runFailed(`switch url timeout: ${JSON.stringify(this.switchPageTask)}`);
                }
            }, 30000);
        }
    }

    initEvents() {
        const eventName = `main-event-from-${taskName}`;
        this.ipcMain.on(`renderer-event-from-${taskName}`, (event, type, ...args) => {
            console.log(`${taskName} ${type}: `, ...args);
            switch(type) {
                case 'error': {
                    this.runFailed(...args);
                    break;
                }
                case 'warning': {
                    break;
                }
                case 'switch-page-task': {
                    this.startSwitchPageTask(args[0]);
                    break;
                }
                case 'page-loaded': {
                    const url = args[0];

                    if (!this.pageLoaded && url == this.config.url) {
                        this.pageLoaded = true;
                        event.sender.send(eventName, 'login', this.access);
                    }

                    if (this.switchPageTask) {
                        if (this.switchPageTask.urlReg.test(url)) {
                            console.log(`${taskName} switch page ${this.switchPageTask.name}-success`);

                            const name = this.switchPageTask.name;
                            clearTimeout(this.switchPageTask.timer);
                            this.switchPageTask = null;

                            switch(name) {
                                case 'goto-main-page': {
                                    break;
                                }
                                default: {
                                    break;
                                }
                            }
                        }
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        });
    }
}

module.exports = new Task();