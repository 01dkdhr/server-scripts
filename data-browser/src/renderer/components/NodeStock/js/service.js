import storage from './storage.js';
import { resolve } from 'path';

const service = {
    loadDays: 0,
    init(config, loadDays) {
        this.loadDays = loadDays;
        storage.init(config, loadDays);
    },
    loadData() {
        return new Promise((resolve, reject) => {
            storage.distinctData('daily_stock', 'dateTime')
            .then((result) => {
                // 筛选出所有时间 按从大到小排序,取最近30个
                const dateArray = result.sort((a, b) => b - a).slice(0, this.loadDays);
                return { dateArray };
            })
            .then(({ dateArray }) => {
                return (storage.getDBData('stocks', {})
                .then((result) => {
                    resolve({
                        stocks: result,
                        dateArray
                    });
                }));
            })
            .catch((err) => {
                reject(err);
            });
        });
    },
    loadDailyStockData(param) {
        return new Promise((resolve, reject) => {
            if (!param.startDate || !param.endDate) {
                reject('param err:', param);
                return;
            }

            const filter = {
                dateTime: {
                    $gte: param.startDate,
                    $lte: param.endDate
                }
            };
            storage.getDBData('daily_stock', filter)
            .then((result) => {
                resolve({ dailyStocks: result });
            })
            .catch((err) => {
                reject(err);
            });
        });    
    }
};

export default service;