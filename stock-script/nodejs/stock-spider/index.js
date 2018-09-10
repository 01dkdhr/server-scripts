const StockCrawlerService = require('./services/StockCrawlerService.js');
const TimeUtil = require('./utils/TimeUtil.js');

function rndTime() {
    return Math.floor(Math.random() * 5000);
}

function main() {
    console.log('last trade date:', TimeUtil.formatDate(TimeUtil.lastTradeDay(), true));

    StockCrawlerService.fetchAllStocks()
    .then((stocks) => {
        if (stocks && stocks.length) {
            for (let i = 0, n = stocks.length; i < n; ++i) {
                const stock = stocks[i];
                setTimeout(() => {
                    StockCrawlerService.fetchDailyStock(stock);
                }, 5000 * i + rndTime());
            }
        }
    });
}

main();