class StockBaseModel {
    constructor(stockId, stockCode, stockName, market) {
        this.id = stockId;
        this.stockCode = stockCode;
        this.stockName = stockName;
        this.market = market;
    }

    getStockCode() {
        const marketId = this.market == 'sh' ? '1' : this.market == 'sz' ? '2' : '';

        return this.stockCode + marketId;
    }
}

module.exports = StockBaseModel;