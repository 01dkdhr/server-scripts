const path = require('path');
const fs = require('fs');
const request = require('request');
const iconv = require('iconv-lite');

const StockBaseModel = require('../models/StockBaseModel.js'); 

const baseUrl = 'http://quote.eastmoney.com/stocklist.html';

const baseStockReg = /(<li><a target="_blank" href="http:\/\/quote\.eastmoney\.com\/.+\.html">.+\(\d{6}\)<\/a><\/li>)/g;
const baseStockInfoReg = /<li><a target="_blank" href="http:\/\/quote\.eastmoney\.com\/([a-zA-Z]{2,})\d+\.html">(.+)\((\d{6})\)<\/a><\/li>/g;

const StockCrawlerService = {
    fetchAllStockBaseModelsFromInternet() {
        return new Promise((resolve, reject) => {
            // request({
            //     url: baseUrl,
            //     method: 'GET'
            // }, (e, r, b) => {
            //     if (e || !b) {
            //         reject(e, r, b);
            //         return;
            //     }

            //     fs.writeFileSync(path.join(__dirname, '../testdata/base-modules.txt'), iconv.decode(new Buffer(b), 'GBK'));
            // });

            const b = fs.readFileSync(path.join(__dirname, '../testdata/base-modules.txt'), 'utf-8');

            const rows = b.match(baseStockReg);
            if (!rows || !rows.length) {
                reject('no base stock link found');
                return;
            }

            rows.forEach((row) => {
                const infos = baseStockInfoReg.exec(row);
                if (infos && infos.length && infos.length >= 4) {
                    const startsCode = infos[3].slice(0, 3);
                    // 去掉基金、证券等非股票代码
                    if (['600', '601', '603', '002', '300', '000'].includes(startsCode)) {
                        const stockBaseModel = new StockBaseModel(null, infos[3], infos[2], infos[1]);
                    }
                }
            });
        });
    }
};

module.exports = StockCrawlerService;