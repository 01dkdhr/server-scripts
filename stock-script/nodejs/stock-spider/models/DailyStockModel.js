// 一只股票的某日行情
class Dailythis {
    constructor(fullStockCode, dateTime, dateString) {
		this.fullStockCode = fullStockCode		// 股票ID
		this.openPrice = 0						// 开盘价
		this.yesterdayClosePrice = 0			// 昨日收盘价
		this.curPrice = 0						// 当前价
		this.averagePrice = 0					// 均价
		this.high = 0							// 最高价
		this.low = 0							// 最低价
		this.tradeVolume = 0					// 成交量
		this.tradeValue = 0						// 成交额
		this.turnoverRate = 0					// 换手率
		this.marketValue = 0					// 市值
		this.circulationValue = 0				// 流通值
		this.pb = 0								// 市净率
		this.pe = 0								// 市盈率
		this.buyVolume = 0						// 外盘
		this.sellVolume = 0						// 内盘
		this.amountRatio = 0					// 量比
		this.entrustRatio = 0					// 委比
		this.superFlowIn = 0					// 超大单流入
		this.superFlowOut  = 0					// 超大单流出
		this.bigFlowIn = 0						// 大单流入
		this.bigFlowOut = 0						// 大单流出
		this.middleFlowIn = 0					// 中单流入
		this.middleFlowOut = 0					// 中单流出
		this.littleFlowIn = 0					// 小单流入
        this.littleFlowOut = 0					// 小单流出
        this.dateTime = dateTime                // 时间戳
		this.dateString = dateString			// 交易日期 2018-09-12
    }

    loadInfo1(info) {
        try {
            this.openPrice = parseFloat(info[29])
			this.yesterdayClosePrice = parseFloat(info[23])
			this.curPrice = parseFloat(info[26])
			this.averagePrice = parseFloat(info[44])
			this.high = parseFloat(info[30])
			this.low = parseFloat(info[31])
			this.tradeVolume = parseInt(info[36])
			this.tradeValue = parseFloat(info[37])
			this.turnoverRate = parseFloat(info[34]) * 0.01
			this.marketValue = parseFloat(info[40])
			this.circulationValue = parseFloat(info[41])
			this.pb = parseFloat(info[39])
			this.pe = parseFloat(info[38])
			this.buyVolume = parseInt(info[46])
			this.sellVolume = parseInt(info[45])
			this.amountRatio = parseFloat(info[35])
			this.entrustRatio = parseFloat(info[42]) * 0.01
        } catch(err) {
            console.log('StockBaseModel loadInfo1 err:', err)
        } 
    }

    loadInfo2(info) {
        this.superFlowIn = parseFloat(info[4])
        this.superFlowOut = parseFloat(info[5])
        this.bigFlowIn = parseFloat(info[6])
        this.bigFlowOut = parseFloat(info[7])
        this.middleFlowIn = parseFloat(info[8])
        this.middleFlowOut = parseFloat(info[9])
        this.littleFlowIn = parseFloat(info[10])
        this.littleFlowOut = parseFloat(info[11])     
    }
}

module.exports = Dailythis;