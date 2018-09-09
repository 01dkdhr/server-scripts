const StockCrawlerService = require('./services/StockCrawlerService.js');

function formatDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month < 10 && (month = '0' + month);
    let day = date.getDate();
    day < 10 && (day = '0' + day);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function lastTradeDate() {
    const date = new Date();
    let week = date.getDay();

    week == 0 && (week = 7);

    return new Date(date - 1000 * 3600 * 24 * (Math.max(week - 5, 0)));
}

function main() {
    const today = lastTradeDate();
    console.log('last trade date:', formatDate(today));

    StockCrawlerService.fetchAllStockBaseModelsFromInternet();
}

main();