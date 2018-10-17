const MongoClient = require('mongodb').MongoClient;

let url = '';
let client;

const storage = {
    init({ path, dbName, user, password }) {
        url = `mongodb://${user}:${password}@${path}/${dbName}`;
    },
    connect() {
        return new Promise((resolve, reject) => {
            try {
                MongoClient.connect(url, { useNewUrlParser: true }, (err, result) => {
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    client = result;
                    resolve();
                });
            } catch(e) {
                reject(e);
            }
        }); 
    },
    disConnect() {
        client.close();
        client = null;
    },
    createTable({ dbName, table }) {
        return new Promise((resolve, reject) => {
            try {
                const db = client.db(dbName);
                db.createCollection(table, (err, result) => {
                    if (err) {
                        throw err;
                    } 
    
                    resolve();
                });
            } catch(err) {
                reject(err);
            }
        });
    },
    multiSave({ dbName, table, datas }) {
        return new Promise((resolve, reject) => {
            try {
                const db = client.db(dbName);
                const collection = db.collection(table);
                collection.insertMany(datas, (err, result) => {
                    if (err) {
                        throw err;
                    } 
    
                    resolve(result);
                });
            } catch(err) {
                reject(err);
            }
        });
    },
    multiUpdate({ dbName, table, filter, datas }) {
        // 先删除table中符合filter的所有数据,再插入datas
        return new Promise((resolve, reject) => {
            try {
                const db = client.db(dbName);
                const collection = db.collection(table);
                collection.deleteMany(filter, (err, result) => {
                    if (err) {
                        throw err;
                    } 
    
                    collection.insertMany(datas, (err, result) => {
                        if (err) {
                            throw err;
                        } 
    
                        resolve();
                    });
                });
            } catch(err) {
                reject(err);
            }
        });
    }
};

module.exports = storage;