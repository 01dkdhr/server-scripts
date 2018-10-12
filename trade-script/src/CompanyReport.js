const xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');
const storage = require('./utils/storage.js');
const _ = require('lodash');

let config = null;
try {
    config = require('../local-config.json')['company-report'];
} catch(err) {
    console.log('load local-config err:', err);
    process.exit();
}

let summaryData,
    debtData,
    profitData,
    majorDisclosureIndicators,
    developmentIndicators,
    profitabilityMeasure;

//读取文件内容
function readFile() {
    const filePath = path.join(__dirname, '../data/company-report.xls');
    if (!fs.existsSync(filePath)) {
        console.log('err: file is not exist:', filePath);
        return;
    }
    const xmlObj = xlsx.parse(filePath);

    // A股公司汇总表
    summaryData = xmlObj[0].data;
    summaryData.splice(0, 2);

    // 资产负债数据
    debtData = xmlObj[1].data;
    debtData.splice(0, 1);

    // 利润数据
    profitData = xmlObj[2].data;
    profitData.splice(0, 1);

    // 主要披露指标
    majorDisclosureIndicators = xmlObj[3].data;
    majorDisclosureIndicators.splice(0, 1);

    // 发展指标
    developmentIndicators = xmlObj[4].data; 
    developmentIndicators.splice(0, 1);

    // 盈利指标
    profitabilityMeasure = xmlObj[5].data; 
    profitabilityMeasure.splice(0, 1);
}

const summaryKey = [
    {
        name: 'code',
        show: '证券代码'
    },
    {
        name: 'name',
        show: '证券名称'
    },
    {
        name: 'nameEn',
        show: '证券英文名称'
    },
    {
        name: 'exchange',
        show: '交易所'
    },
    {
        name: 'industryCode',
        show: '证监会行业分类代码'
    },
    {
        name: 'industryName',
        show: '证券代码'
    },
    {
        name: 'industryNameEn',
        show: '证监会行业分类英文名称'
    },
    {
        name: 'industryCodeFull',
        show: '证监会行业分类代码(全)'
    },
    {
        name: 'industryNameFull',
        show: '证监会行业分类名称(全)'
    },
    {
        name: 'industryNameEnFull',
        show: '证监会行业分类英文名称(全)'
    }
];
function buildSummaryData(obj) {
    return {
        code: obj[0] || '',
        name: obj[1] || '',
        nameEn: obj[2] || '',
        exchange: obj[3] || '',
        industryCode: obj[4] || '',
        industryName: obj[5] || '',
        industryNameEn: obj[6] || '',
        industryCodeFull: obj[7] || '',
        industryNameFull: obj[8] || '',
        industryNameEnFull: obj[9] || ''
    };
}

const debtKey = [
    {
        name: 'time',
        show: '期间'
    },
    {
        name: 'TA',
        show: '资产总计'
    },
    {
        name: 'TL',
        show: '负债合计'
    },
    {
        name: 'TE',
        show: '所有者权益合计'
    }
];
function buildDebtData(obj) {
    return {
        code: obj[0] || '',
        time: obj[1] || '',
        TA: Number(obj[2] || '0'),
        TL: Number(obj[3] || '0'),
        TE: Number(obj[4] || '0')
    };
}

const profitKey = [
    {
        name: 'time',
        show: '期间'
    },
    {
        name: 'GR',
        show: '营业总收入'
    },
    {
        name: 'TOC',
        show: '营业总成本'
    },
    {
        name: 'TP',
        show: '利润总额'
    },
    {
        name: 'RP',
        show: '净利润'
    },
    {
        name: 'OP',
        show: '营业利润'
    }
];
function buildProfitData(obj) {
    return {
        code: obj[0] || '',
        time: obj[1] || '',
        GR: Number(obj[2] || '0'),
        TOC: Number(obj[3] || '0'),
        TP: Number(obj[4] || '0'),
        RP: Number(obj[5] || '0'),
        OP: Number(obj[6] || '0'),
    };
}

const majorDisclosureKey = [
    {
        name: 'time',
        show: '截止日期'
    },
    {
        name: 'ROE',
        show: '净资产收益率（加权平均）'
    },
    {
        name: 'NCF',
        show: '每股经营活动产生的现金流量净额'
    },
    {
        name: 'MRQ',
        show: '每股净资产（归属于上市公司股东）'
    },
    {
        name: 'BOE',
        show: '基本每股收益'
    }
];
function buildMajorData(obj) {
    return {
        code: obj[0] || '',
        time: obj[1] || '',
        ROE: Number(obj[2] || '0'),
        NCF: Number(obj[3] || '0'),
        MRQ: Number(obj[4] || '0'),
        BOE: Number(obj[5] || '0')
    };
}

const developmentKey = [
    {
        name: 'time',
        show: '期间'
    },
    {
        name: 'GROEP',
        show: '净利润增长率（归属于母公司）'
    },
    {
        name: 'IROBR',
        show: '营业收入增长率（总收入）'
    }
]
function buildDevelopmentData(obj) {
    return {
        code: obj[0] || '',
        time: obj[1] || '',
        GROEP: Number(obj[2] || '0'),
        IROBR: Number(obj[3] || '0')
    };
}

const profitabilityKey = [
    {
        name: 'time',
        show: '截止日期'
    },
    {
        name: 'OPR',
        show: '营业毛利率'
    },
    {
        name: 'OPM',
        show: '营业利润率'
    },
    {
        name: 'NOIR',
        show: '营业净利率'
    },
    {
        name: 'TOCR',
        show: '总营业成本率'
    }
];
function buildProfitabilityData(obj) {
    return {
        code: obj[0] || '',
        time: obj[1] || '',
        OPR: Number(obj[2] || '0'),
        OPM: Number(obj[3] || '0'),
        NOIR: Number(obj[4] || '0'),
        TOCR: Number(obj[5] || '0')
    };
}

function buildSingleData(code) {
    if (!code) {
        return null;
    }
    return {
        code: code,
        summary: null,
        debtArray: [],
        profitArray: [],
        majorArray: [],
        developmentArray: [],
        profitAbilityArray: []
    }
}

// 任务1 数据库中写入company-titles
function saveCompanyTitles() {
    storage.init({
        path: config.path,
        dbName: config.dbName,
        user: config.user,
        password: config.password
    });
    
    storage.multiSave({
        dbName: config.dbName,
        table: 'company-titles',
        datas: [
            {
                name: 'summary',
                titles: summaryKey    
            },
            {
                name: 'debtArray',
                titles: debtKey    
            },
            {
                name: 'profitArray',
                titles: profitKey    
            },
            {
                name: 'majorArray',
                titles: majorDisclosureKey    
            },
            {
                name: 'developmentArray',
                titles: developmentKey    
            },
            {
                name: 'profitAbilityArray',
                titles: profitabilityKey    
            }
        ]
    });
}

// 任务2, 数据库中写入company-report
function saveCompanyReport() {
    readFile();
    const totalArr = [];
    summaryData.forEach((item) => {
        const summary = buildSummaryData(item);
        let obj = _.find(totalArr, { code: summary.code });
        if (obj) {
            obj.summary = summary;
        } else {
            obj = buildSingleData(summary.code);
            if (obj) {
                obj.summary = summary;
                totalArr.push(obj);
            }
        }
    });

    debtData.forEach((item) => {
        const debt = buildDebtData(item);
        let obj = _.find(totalArr, { code: debt.code });
        if (obj) {
            obj.debtArray.push(debt);
        } else {
            obj = buildSingleData(debt.code);
            if (obj) {
                obj.debtArray.push(debt);
                totalArr.push(obj);
            }
        }
    });

    profitData.forEach((item) => {
        const profit = buildProfitData(item);
        let obj = _.find(totalArr, { code: profit.code });
        if (obj) {
            obj.profitArray.push(profit);
        } else {
            obj = buildSingleData(profit.code);
            if (obj) {
                obj.profitArray.push(profit);
                totalArr.push(obj);
            }
        }
    });

    majorDisclosureIndicators.forEach((item) => {
        const major = buildMajorData(item);
        let obj = _.find(totalArr, { code: major.code });
        if (obj) {
            obj.majorArray.push(major);
        } else {
            obj = buildSingleData(major.code);
            if (obj) {
                obj.majorArray.push(major);
                totalArr.push(obj);
            }
        }
    });

    developmentIndicators.forEach((item) => {
        const develop = buildDevelopmentData(item);
        let obj = _.find(totalArr, { code: develop.code });
        if (obj) {
            obj.developmentArray.push(develop);
        } else {
            obj = buildSingleData(develop.code);
            if (obj) {
                obj.developmentArray.push(develop);
                totalArr.push(obj);
            }
        }
    });

    profitabilityMeasure.forEach((item) => {
        const profitability = buildProfitabilityData(item);
        let obj = _.find(totalArr, { code: profitability.code });
        if (obj) {
            obj.profitAbilityArray.push(profitability);
        } else {
            obj = buildSingleData(profitability.code);
            if (obj) {
                obj.profitAbilityArray.push(profitability);
                totalArr.push(obj);
            }
        }
    });

    storage.init({
        path: config.path,
        dbName: config.dbName,
        user: config.user,
        password: config.password
    });

    storage.multiSave({
        dbName: config.dbName,
        table: 'company-report',
        datas: totalArr
    });
}

saveCompanyReport();



