const _BaseTask = require('./_baseTask.js');

class WeiboTask extends _BaseTask {
    run() {
        this.nightmare
        .goto('https://www.baidu.com')
        .evaluate(() => {
            window.__nightmare.sendData('hello', '123');
        })
        .end()
        .catch(error => {
            console.error('err:', error)
        });
    }

    handleEvents() {
        this.nightmare.on('page', (type, ...args) => {
            if (type == 'hello') {
                console.log(args)
            }
        })
    }
}

module.exports = new WeiboTask();