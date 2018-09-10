const path = require('path');
const fs = require('fs');
const request = require('request');
const iconv = require('iconv-lite');

const StockBaseModel = require('../models/StockBaseModel.js'); 
const DailyStockModel = require('../models/DailyStockModel.js');
const StockStorage = require('../storages/StockStorage.js');
const TimeUtil = require('../utils/TimeUtil.js');

const baseUrl = 'http://quote.eastmoney.com/stocklist.html';

const baseStockReg = /(<li><a target="_blank" href="http:\/\/quote\.eastmoney\.com\/.+\.html">.+\(\d{6}\)<\/a><\/li>)/g;
const baseStockInfoReg = /<li><a target="_blank" href="http:\/\/quote\.eastmoney\.com\/([a-zA-Z]{2,})\d+\.html">(.+)\((\d{6})\)<\/a><\/li>/g;

const StockCrawlerService = {
    _baseRequest(url, method) {
        return new Promise((resolve, reject) =>{
            request({
                url: url,
                method: method || 'GET',
                encoding: null
            }, (e, r, b) => {
                if (e || !b) {
                    reject(e, r, b);
                    return;
                }

                resolve(iconv.decode(new Buffer(b), 'GBK'));
            });
        });
    },
    fetchAllStocks() {
        // 从东方财富网抓取所有股票代码、名字及所属市场
        return new Promise((resolve, reject) => {
            this._baseRequest(baseUrl)
            .then((body) => {
                const rows = body.match(baseStockReg);
                if (!rows || !rows.length) {
                    reject('no base stock link found');
                    return;
                }

                const stocks = [];
                rows.forEach((row) => {
                    const infos = baseStockInfoReg.exec(row);
                    if (infos && infos.length && infos.length >= 4) {
                        const startsCode = infos[3].slice(0, 3);
                        // 去掉基金、证券等非股票代码
                        if (['600', '601', '603', '002', '300', '000'].includes(startsCode)) {
                            stocks.push(new StockBaseModel(infos[3], infos[2], infos[1]));
                        }
                    }
                });

                if (stocks.length) {
                    StockStorage.saveStockBaseModel(stocks)
                    .then((result) => {
                        resolve(stocks);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                } else {
                    reject('stocks is empty');
                }
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    fetchDailyStock(stock) {
        // 抓取一只股票当天的行情数据
        const { dateTime, dateString } = TimeUtil.getTimeAndString(new Date());
        const model = new DailyStockModel(stock.fullStockCode, dateTime, dateString);

        const info1Url = 'http://nufm2.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?' +
            `type=CT&sty=FDT&token=beb0a0047196124721f56b0f0ff5a27c&cmd=${stock.fullStockCode}`;
        
        const info2Url = 'http://nufm.dfcfw.com/EM_Finance2014NumericApplication/JS.aspx?' +
            `type=CT&cmd=${stock.fullStockCode}&sty=DCFF&st=z&sr=&p=&ps=&cb=&js=var%%20zjlx_detail=(x)&token=7bc05d0d4c3c22ef9fca8c2a912d779c`;
            
        return new Promise((resolve, reject) => {
            this._baseRequest(info1Url)
            .then((body) => {
                const info1Reg = /\(\["(.*)"\]\)/g;
                const matches1 = info1Reg.exec(body);
                if (matches1) {
                    model.loadInfo1(matches1[1].split(',')); 
                    
                    this._baseRequest(info2Url)
                    .then((body) => {
                        const info2Reg = /var% zjlx_detail="(.*)"/g;
                        const matches2 = info2Reg.exec(body);
                        if (matches2) {
                            model.loadInfo2(matches2[1].split(',')); 
                            StockStorage.saveDailyStockModel(model);        
                        }
                    }).catch((err) => {
                        reject(err);
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
        });
    }
};

module.exports = StockCrawlerService;