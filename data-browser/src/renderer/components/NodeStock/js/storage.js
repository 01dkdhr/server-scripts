const MongoClient = require('mongodb').MongoClient;

const storage = {
    config: null,
    dbHost: '',
    init(config, loadDays) {
        this.config = config;
        const dbInfo = config['db-info'];
        this.dbHost = `mongodb://${dbInfo.host}/${dbInfo['db-name']}`;
    },
    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbHost) {
                reject('db host is empty'); 
                return;      
            }
            try {
                MongoClient.connect(this.dbHost, { useNewUrlParser: true }, (err, client) => {
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
    getDBData(tableName, filter) {
        return (this.connect()
        .then((client) => {
            try {
                const db = client.db(this.config['db-name']);
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
    distinctData(tableName, key) {
        // 获取某一个字段的值,去重
        return (this.connect()
        .then((client) => {
            try {
                const db = client.db(this.config['db-name']);
                const collection = db.collection(tableName);
                return new Promise((resolve, reject) => {
                    collection.distinct(key, (err, result) => {
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
    }
};

export default storage;