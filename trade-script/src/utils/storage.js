const MongoClient = require('mongodb').MongoClient;

let url = '';

function connect() {
    return new Promise((resolve, reject) => {
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
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
}

const storage = {
    init({ path, dbName, user, password }) {
        url = `mongodb://${user}:${password}@${path}/${dbName}`;
    },
    createTable({ dbName, table }) {
        return (connect()
        .then((client) => {
            try {
                const db = client.db(dbName);
                db.createCollection(table, (err, result) => {
                    if (err) {
                        throw err;
                    } 

                    client.close();
                    return Promise.resolve();
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
    multiSave({ dbName, table, datas }) {
        return (connect()
        .then((client) => {
            try {
                const db = client.db(dbName);
                const collection = db.collection(table);
                collection.insertMany(datas, (err, result) => {
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
    multiUpdate({ dbName, table, filter, datas }) {
        // 先删除table中符合filter的所有数据,再插入datas
        return (connect()
        .then((client) => {
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
    
                        client.close();
                        return Promise.resolve();
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
    }
};

module.exports = storage;