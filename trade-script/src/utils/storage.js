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
        try {
            const db = client.db(dbName);
            db.createCollection(table, (err, result) => {
                if (err) {
                    throw err;
                } 

                return Promise.resolve();
            });
        } catch(err) {
            return Promise.reject(err);
        }
    },
    multiSave({ dbName, table, datas }) {
        try {
            const db = client.db(dbName);
            const collection = db.collection(table);
            collection.insertMany(datas, (err, result) => {
                if (err) {
                    throw err;
                } 

                return Promise.resolve(result);
            });
        } catch(err) {
            return Promise.reject(err);
        }
    },
    multiUpdate({ dbName, table, filter, datas }) {
        // 先删除table中符合filter的所有数据,再插入datas
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

                    return Promise.resolve();
                });
            });
        } catch(err) {
            return Promise.reject(err);
        }
    }
};

module.exports = storage;