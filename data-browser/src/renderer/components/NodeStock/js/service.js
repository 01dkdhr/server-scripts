import storage from './storage.js';
import { resolve } from 'path';

const service = {
    loadDays: 0,
    init(config, loadDays) {
        this.loadDays = loadDays;
        storage.init(config, loadDays);
    },
    loadData() {
        return new Promise((resole, reject) => {
            storage.distinctData('daily_stock', 'dateTime')
            .then((result) => {
                // 筛选出所有时间 按从大到小排序,取最近30个
                const dateArray = result.sort((a, b) => b - a).slice(0, this.loadDays);
                const endDate = dateArray[dateArray.length - 1];
                return { dateArray, endDate };
            })
            .then(({ dateArray, endDate }) => {
                return (storage.getDBData('daily_stock', { dateTime: { $gte: endDate } })
                .then((result) => {
                    return Promise.resolve({ dailyStocks: result, dateArray });
                }));
            })
            .then(({ dailyStocks, dateArray }) => {
                return (storage.getDBData('stocks', {})
                .then((result) => {
                    resole({
                        stocks: result,
                        dailyStocks,
                        dateArray
                    });
                }));
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
};

export default service;