const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;

let mongoConfig = null;
let url = '';
try {
    const localConfig = require(path.join(__dirname, '../local-config.json'));
    mongoConfig = localConfig['mongo-config'];
    url = `mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.url}/${mongoConfig['db-name']}`;
} catch(e) {
    console.log('init StockStorage err:', e);
}

const StockStorage = {
    connect() {
        return new Promise((resolve, reject) => {
            if (!url) {
                reject('url is empty'); 
                return;      
            }
            try {
                MongoClient.connect(url, (err, client) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(client);
                });
            } catch(e) {
                reject(e);
            }
        });   
    },
    saveStockBaseModel(stocks) {
        if (!stocks || !stocks.length) {
            return Promise.reject('stocks is empty');
        }

        const tableName = 'stocks';

        return (this.connect()
        .then((client) => {
            try {
                const db = client.db(mongoConfig['db-name']);
                const collection = db.collection(tableName);
                collection.deleteMany({}, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    collection.insertMany(stocks, (err, result) => {
                        if (err) {
                            throw err;
                        } 

                        client.close();
                        return Promise.resolve(result);
                    });
                });
            } catch(err) {
                client.close();
                return Promise.reject(err);
            }
        })
        .catch((err) => {
            return Promise.reject(err);  
        }));
    },
    saveDailyStockModel(model) {
        if (!model) {
            return Promise.reject('model is empty');
        }

        const tableName = 'daily_stock';
        return (this.connect()
        .then((client) => {
            try {
                const db = client.db(mongoConfig['db-name']);
                const collection = db.collection(tableName);
                const filter = {
                    fullStockCode: model.fullStockCode,
                    dateTime: model.dateTime
                };
                collection.replaceOne(filter, model, { upsert: true }, (err, result) => {
                    if (err) {
                        throw err;
                    } 

                    client.close();
                    return Promise.resolve(result);
                });
            } catch(err) {
                client.close();
                return Promise.reject(err);
            }
        })
        .catch((err) => {
            return Promise.reject(err);  
        }));
    },
    getDBData(tableName, filter) {
        return (this.connect()
        .then((client) => {
            try {
                const db = client.db(mongoConfig['db-name']);
                const collection = db.collection(tableName);
                return new Promise((resolve, reject) => {
                    collection.find(filter || {}).toArray((err, result) => {
                        if (err) {
                            reject(err);
                            return;
                        } 
    
                        client.close();
                        return resolve(result);
                    });
                })
            } catch(err) {
                client.close();
                return Promise.reject(err);
            }
        })
        .catch((err) => {
            return Promise.reject(err);  
        }));
    },
    getAllStocks(filter) {
        const tableName = 'stocks';
        return this.getDBData(tableName, filter);
    },
    getDailyStocks(filter) {
        const tableName = 'daily_stock';
        return this.getDBData(tableName, filter);
    }
};

module.exports = StockStorage;