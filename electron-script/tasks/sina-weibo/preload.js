const { ipcRenderer } = require('electron');

const taskName = 'sina-weibo';
const eventName = `renderer-event-from-${taskName}`;

function sendNormalInfo(task, ...args) {
    ipcRenderer.send(eventName, task, ...args);
}

function sendErrInfo(error) {
    ipcRenderer.send(eventName, 'error', error);       
}

function sendWrarningInfo(error) {
    ipcRenderer.send(eventName, 'warning', error);       
}

ipcRenderer.on(`main-event-from-${taskName}`, (event, type, ...args) => {
    switch(type) {
        case 'login': {
            const access = args[0];
            setTimeout(() => {
                login(access);
            }, 2000);
            break;
        }
        default: {
            break;
        }
    }
});

window.onload= function() {
    sendNormalInfo('page-loaded', location.href);

    location.href = 'https://www.baidu.com';
}

function login(access) {
    try {
        const userInput = document.getElementById('loginname');
        userInput.focus();
        userInput.value= access.user;

        let passwordInput = null;
        let submitBtn = null;
        const parentNode = userInput.parentNode.parentNode.parentNode;
        for (let i = 0; i < parentNode.children.length; ++i) {
            const node = parentNode.children[i];
            if (node.classList.value.includes('password')) {
                passwordInput = node.children[0].children[0];    
            } else if (node.classList.value.includes('login_btn')) {
                submitBtn = node.children[0];
            }
        }

        passwordInput.focus();
        passwordInput.value= access.password;

        setTimeout(() => {
            submitBtn.focus();
            submitBtn.click();

            sendNormalInfo('switch-page-task', {
                name: 'goto-main-page',
                urlReg: '^https://weibo.com/u/\\d+/home\\?wvr=5&lf=reg$'
            });
        }, 2000);
    } catch(err) {
        sendErrInfo(`login err: ${err}`);
    }
}