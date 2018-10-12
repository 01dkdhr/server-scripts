const path = require('path');
const fs = require('fs');
const storage = require('./utils/storage.js');

let config = null;
try {
    config = require('../local-config.json')['trade-point-data'];
} catch(err) {
    console.log('load local-config err:', err);
    process.exit();
}

// 要导入的日期
const pointDate = '181009';

const SHTable = `trade-point-sh-${pointDate}`;
const SZTable = `trade-point-sz-${pointDate}`;

function start() {
    if (!pointDate) {
        console.log('err: pointDate is empty');
        process.exit();
    }

    let filePath = path.join(__dirname, '../data/tmp');
    if (!fs.existsSync(filePath)) {
        console.log('err: filePath is not exit:', filePath);
        process.exit();   
    }

    let files = fs.readdirSync(filePath);
    for (let i = 0; i < files.length; ++i) {
        var stat = fs.statSync(path.join(filePath, files[i]));
        if (stat.isDirectory()) {
            if (files[i].includes(`${pointDate}`)) {
                filePath = path.join(filePath, files[i]);
                break;
            }
        }    
    }

    if (!filePath.includes(`${pointDate}`)) {
        console.log('未找到目标文件夹:', pointDate);
        process.exit();
    }

    files = fs.readdirSync(filePath);
    console.log(`总共需要写入${files.length}文件`);

    let count = 0;
    function runOnce() {
        if (!files || !files.length) {
            console.log(`总共需要写入${files.length}文件,一共完成了${count}个文件`);
            return;
        }

        const file = files.shift();
        const stat = fs.statSync(path.join(filePath, file));
        if (!stat.isDirectory()) {
            if (file.indexOf('SH') == 0 || file.indexOf('SZ') == 0) {
                const market = file.slice(0, 2);
                const code = file.slice(2, 8);
                const totalArray = [];

                const data = fs.readFileSync(path.join(filePath, file), {encoding: 'utf-8'});
                const dataArray = data.split('\n'); 
                dataArray.forEach((item) => {
                    const itemArray = item.split(/\s+/);   
                    let time = '';
                    let price = '';
                    let count = '';
                    for (let i = 0; i < itemArray.length; ++i) {
                        if (itemArray[i]) {
                            if (!time) {
                                time = itemArray[i];
                            } else if (!price) {
                                price = itemArray[i];   
                            } else if (!count) {
                                count = itemArray[i];
                                break;
                            }
                        }
                    }

                    if (time && price && count) {
                        totalArray.push({
                            date: pointDate,
                            code,
                            market,
                            time,
                            price,
                            count
                        });    
                    }
                });

                const tableName = market == 'SH' ? SHTable : SZTable;
                storage.multiUpdate({
                    dbName: config.dbName,
                    table: tableName,
                    filter: {
                        date: pointDate,
                        code,
                        market   
                    },
                    datas: totalArray
                }).then(() => {
                    count ++;
                    console.log(`写入: ${code}完成, 剩余${files.length}文件`);
                    fs.unlinkSync(path.join(filePath, file));
                    runOnce();    
                });
            } else {
                console.log(`文件${file}未写入`);
                fs.unlinkSync(path.join(filePath, file));
                runOnce();     
            }       
        } else {
            console.log(`文件${file}未写入`);
            fs.unlinkSync(path.join(filePath, file));
            runOnce();   
        }
    }

    runOnce();
}

function run() {
    storage.init({
        path: config.path,
        dbName: config.dbName,
        user: config.user,
        password: config.password
    });

    storage.createTable({
        dbName: config.dbName,
        table: SHTable
    })
    .then(() => {
        storage.createTable({
            dbName: config.dbName,
            table: SZTable
        })
    })
    .then(() => {
        start();
    });
}

run();