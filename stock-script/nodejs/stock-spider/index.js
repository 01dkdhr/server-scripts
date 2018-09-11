const StockCrawlerService = require('./services/StockCrawlerService.js');
const TimeUtil = require('./utils/TimeUtil.js');


function main() {
    console.log('last trade date:', TimeUtil.formatDate(TimeUtil.lastTradeDay(), true));

    StockCrawlerService.fetchAllStocks()
    .then((stocks) => {
        if (stocks && stocks.length) {
            StockCrawlerService.fetchAllDailyStocks();
        }
    });
}

main();