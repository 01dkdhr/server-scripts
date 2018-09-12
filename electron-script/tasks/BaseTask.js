const { BrowserWindow, ipcMain } = require('electron');

class BaseTask {
    constructor(config) {
        // 初始化各个task自己的变量
        this.init();
        const baseConfig = {
            taskName: 'BaseTask'
        };
        this.config = Object.assign(baseConfig, this.getConfig());
        this.ipcMain = ipcMain;
        this._renderer = this.createRenderer();  
        this.initEvents();      
    }

    init() {

    }

    getConfig() {
        return {

        };
    }

    createRenderer() {
        const config = this.config;
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            title: config.taskName,
            webPreferences: {
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                preload: config.preload || '',
                partition: `partition_${config.taskName}`,
                webSecurity: true,
                allowRunningInsecureContent: true
            }
        });

        win.webContents.openDevTools({ mode: 'detach' });

        win.on('closed', () => {
            win = null;
        })

        return win;
    }

    run() {
        return new Promise((resolve, reject) => {
            this.resolveHandler = resolve;
            this.rejectHandler = reject;
            this._renderer.loadURL(this.config.url);
        });
    }

    runSuccess(...args) {
        this.resolveHandler && this.resolveHandler(...args);
    }

    runFailed(...args) {
        this.rejectHandler && this.rejectHandler(...args);        
    }

    initEvents() {

    }
}

module.exports = BaseTask;