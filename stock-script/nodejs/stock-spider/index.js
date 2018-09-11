const StockCrawlerService = require('./services/StockCrawlerService.js');
const TimeUtil = require('./utils/TimeUtil.js');


function main() {
    console.log('last trade date:', TimeUtil.formatDate(TimeUtil.lastTradeDay(), true));

    if ((new Date()).getHours() < 15) {
        console.log('未到15点,无法同步当天数据');
        return;
    }

    StockCrawlerService.fetchAllStocks()
    .then((stocks) => {
        if (stocks && stocks.length) {
            StockCrawlerService.fetchAllDailyStocks();
        }
    });
}

main();