import { ipcMain, BrowserWindow } from 'electron';

const stockDeatilUrl = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/stock-detail.html`
  : `file://${__dirname}/stock-detail.html`

export default {
    init() {
        ipcMain.on('node-stock-open-detail-window', (event, stock, dailyStocks) => {
            const window = new BrowserWindow({
                height: 563,
                useContentSize: true,
                width: 1000
            });

            window.extData = {
                stock,
                dailyStocks    
            };
        
            window.loadURL(stockDeatilUrl);
        });    
    }
};