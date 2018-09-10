class StockBaseModel {
    constructor(stockCode, stockName, market) {
        this.stockCode = stockCode
        this.stockName = stockName;
        this.market = market;
        
        const marketId = market == 'sh' ? '1' : market == 'sz' ? '2' : '';
        this.fullStockCode = stockCode + marketId;
    }
}

module.exports = StockBaseModel;