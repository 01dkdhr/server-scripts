import { Menu, ipcMain, app, dialog } from 'electron';

const MenuManager = {
    mainWindow: null,
    init(mainWindow) {
        this.mainWindow = mainWindow;
        this.setAppMenu(this.defaultTemplate());

        // renderer发出的set-app-menu data格式
        // [
        //     {
        //         label: '回到首页',
        //         handleEvent: 'app-menu-goto-homepage'
        //     },
        //     {
        //         label: '选项',
        //         submenu: [
        //             {
        //                 label: '载入数据',
        //                 handleEvent: 'app-menu-node-stock-load-data'
        //             }
        //         ]
        //     },
        // ]
        const that = this;
        ipcMain.on('set-app-menu', (event, data) => {
            if (!data instanceof Array) {
                return;
            }

            function addMenu(parent, item) {
                if (!parent) {
                    return;
                }

                const menu = {
                    label: item.label || '未命名'    
                };
                if (item.handleEvent) {
                    menu.click = function() {
                        if (that.mainWindow && that.mainWindow.webContents) {
                            that.mainWindow.webContents.send(item.handleEvent);    
                        }
                    }
                } else if (item.submenu && item.submenu.length) {
                    menu.submenu = [];

                    item.submenu.forEach((sub) => {
                        addMenu(menu.submenu, sub);    
                    });
                }
                parent.push(menu);
            }

            const template = [];
            data.forEach((item) => {
                addMenu(template, item);
            });
            const defTemplate = this.defaultTemplate();
            defTemplate.forEach((menu) => {
                template.push(menu);
            })
            this.setAppMenu(template);
        });
    },
    setAppMenu(template) {
        try {
            Menu.setApplicationMenu(Menu.buildFromTemplate(template));
        } catch (err) {
            console.log(`setAppMenu err: ${err}`);
        }
    },
    defaultTemplate() {
        return [
            {
                label: '退出',   
                click() {
                    const options = {
                        type: 'info',
                        title: '退出',
                        message: "您确定要退出吗？",
                        buttons: ['确定', '取消']
                    }
                    dialog.showMessageBox(options, function(index) {
                        if (index == 0) {
                            app.quit();
                        }
                    })
                } 
            }
        ]
    },
};

export default MenuManager;