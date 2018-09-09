const Nightmare = require('nightmare');
const path = require('path');

class _BaseTask {
    constructor(){
        this.nightmare = Nightmare({ 
            show: true,
            openDevTools: {
                mode: 'detach'
            },
            webPreferences: {
                preload: path.join(__dirname, '../util/preload.js'),
                nodeIntegration: false
            }
        });

        this.handleEvents();
    }

    run() {

    }

    handleEvents() {
        
    }
}

module.exports = _BaseTask;