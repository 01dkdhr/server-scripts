<template>
<div id="node-stock">
    <div class="tool-bar">
        <!-- 数据库加载状态 -->
        <span class="db-state" 
            :class="[stateData.dbInited ? 'success' : 'fail']">
            {{stateData.dbInited ? '数据加载成功' : '数据未加载'}}
        </span>
        <!-- 时间选择 -->
        <div class="date-area">
            <input type="radio" id="group-date" value="group-date" v-model="dateMode">
            <span>起始时间:</span>
            <input :disabled="dateMode !== 'group-date'" type="date" name="start-date" v-model="dateGroup.startDate"/>
            <span>截止时间:</span>
            <input :disabled="dateMode !== 'group-date'" type="date" name="end-date" v-model="dateGroup.endDate"/>
        </div>
        <div class="date-area">
            <input type="radio" id="single-date" value="single-date" v-model="dateMode">
            <span>单一时间:</span>
            <input :disabled="dateMode !== 'single-date'" type="date" name="single-date" v-model="dateSingle.date"/>
        </div>
        <!-- 市场选择 -->
        <div class="market-select">
            <span>市场:</span>
            <select v-model="marketMode">
                <option v-for="(mode, index) in marketList" :value="mode" :key="index">{{mode}}</option>
            </select>
        </div>
    </div>
    <div class="top-place-holder"></div>
    <!-- 股票表格 -->
    <table border="1" class="stock-table">
    <tr>
        <th v-for="head in tableHeader" :key="head">{{getShowWord(head)}}</th>
    </tr>
    <tr v-for="stock in showStocks" :key="stock.fullStockCode">
        <td v-for="head in tableHeader" :key="head">{{stock[head] || '-'}}</td>
    </tr>
    </table>
</div>
</template>

<script>
import { ipcRenderer } from 'electron';
import service from './js/service.js';
import TimeUtil from '@/utils/TimeUtil.js';
import _ from 'lodash';

const defaultTableHeader = ['stockName', 'fullStockCode', 'curPrice', 'averagePrice', 'buyVolume', 'yesterdayClosePrice', 'openPrice', 'marketValue', 'high', 'low', 'pb', 'pe', 'amountRatio', 'turnoverRate', 'tradeVolume', 'tradeValue', 'sellVolume', 'entrustRatio', 'circulationValue', 'superFlowIn', 'superFlowOut', 'bigFlowIn', 'bigFlowOut', 'middleFlowIn', 'middleFlowOut', 'littleFlowIn', 'littleFlowOut'];
export default {
    name: 'node-stock',
    data() {
        return {
            dateGroup: {
                startDate: 0,
                endDate: 0
            },
            dateSingle: {
                date: 0
            },
            dateMode: 'single-date',
            marketList: ['all', 'sh', 'sz'],
            marketMode: 'all',
            tableHeader: defaultTableHeader,
            sortKeys: [] // 排序字段
        }
    },
    computed: {
        stateData() {
            return this.$store.state.NodeStock;
        },
        showStocks() {
            const list = [];
            this.stateData.stocks.slice(0, 10).forEach((stock) => {
                if (this.marketMode !== 'all' && stock.market !== this.marketMode) {
                    return;
                }

                const item = {
                    stockName: stock.stockName,
                    fullStockCode: stock.fullStockCode    
                };

                if (this.dateMode == 'single-date') {
                    const dailyStock = _.find(this.stateData.dailyStocks, { 
                        fullStockCode: stock.fullStockCode,
                        dateTime: TimeUtil.transStringToDate(this.dateSingle.date)
                    }); 
                    
                    if (dailyStock) {
                        Object.assign(item, dailyStock);
                        list.push(item);
                    }
                } else if (this.dateMode == 'group-date') {
                    const start = TimeUtil.transStringToDate(this.dateGroup.startDate);
                    const end = TimeUtil.transStringToDate(this.dateGroup.endDate);
                    const dailyStocks = _.filter(this.stateData.dailyStocks, (e) => {
                        return ((e.fullStockCode == stock.fullStockCode) 
                            && (e.dateTime >= start) && (e.dateTime <= end));
                    }); 

                    if (dailyStocks && dailyStocks.length) {
                        Object.Keys(dailyStocks).forEach((key) => {
                            let count = 0;
                            let totalVaule = 0;
                            dailyStocks.forEach((e) => {
                                if (e[key]) {
                                    totalVaule += e[key];
                                    count ++;    
                                }
                            });   
                            
                            item[key] = count ? (totalVaule / count) : 0;
                        });
                        
                        list.push(item);
                    }
                }

            });

            return list;
        }
    },
    created() {
        service.init(this.stateData.config, this.stateData.loadDays);
        this.asyncLoadData();
        ipcRenderer.on('app-menu-node-stock-load-data', () => {
            this.$store.commit('SET_DB_INITED', false);
            this.asyncLoadData()
        });
    },
    methods: {
        asyncLoadData() {
            service.loadData()
            .then(({ stocks, dailyStocks, dateArray }) => {
                this.$store.commit('SET_STOCKS', stocks);
                this.$store.commit('SET_DAILY_STOCKS', dailyStocks);
                this.$store.commit('SET_DATE_ARRAY', dateArray);
                this.$store.commit('SET_DB_INITED', true);   
                
                this.dateGroup.startDate = TimeUtil.transDateToString(this.stateData.dateArray[this.stateData.dateArray.length - 1]);
                this.dateGroup.endDate = TimeUtil.transDateToString(this.stateData.dateArray[0]);
                this.dateSingle.date = this.dateGroup.endDate;
            })
            .catch((err) => {
                console.log('asyncLoadData err:', err)
            });
        },
        getShowWord(key) {
            switch(key) {
            case 'stockName':
                return '名称';
            case 'fullStockCode':
                return '代码';
            case 'amountRatio':
                return '数量比率';
            case 'averagePrice':
                return '平均价格';
            case 'bigFlowIn':
                return '大流入';
            case 'bigFlowOut':
                return '大流出';
            case 'buyVolume':
                return '购买量';
            case 'circulationValue':
                return '流通价值';
            case 'curPrice':
                return '当前价格';
            case 'entrustRatio':
                return '委托比率';
            case 'high':
                return '最高价';
            case 'littleFlowIn':
                return '小流入';
            case 'littleFlowOut':
                return '小流出';
            case 'low':
                return '最低价';
            case 'marketValue':
                return '市场价值';
            case 'middleFlowIn':
                return '中流入';
            case 'middleFlowOut':
                return '中流出';
            case 'openPrice':
                return '今日开价';
            case 'pb':
                return '平均市净率';
            case 'pe':
                return '市盈率';
            case 'sellVolume':
                return '销售量';
            case 'superFlowIn':
                return '超级流入';
            case 'superFlowOut':
                return '超级流出';
            case 'tradeValue':
                return '交易值';
            case 'tradeVolume':
                return '交易量';
            case 'turnoverRate':
                return '换手率';
            case 'yesterdayClosePrice':
                return '昨日收价';
            default:
                return '';
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        // 设置appmenu
        ipcRenderer.send('set-app-menu', [
            {
                label: '回到首页',
                handleEvent: 'app-menu-goto-homepage'
            },
            {
                label: '载入数据',
                handleEvent: 'app-menu-node-stock-load-data'    
            }
        ]);
        next();
    },
    watch: {
        // marketMode: (newValue) => {
        //     console.log(newValue)
        // }
    }
}
</script>

<style lang="scss" scoped>
#node-stock {
    .tool-bar {
        position: absolute;
        height: 30px;
        z-index: 999;
        width: 100%;
        background-color: #D2E9FF;
        padding: 0 10px;
        font-size: 14px;

        display: flex;
        align-items: center;
        justify-content: left;

        .db-state {
            &.success {
                color: green;
            }    

            &.fail {
                color: red;
            }
        }

        .date-area, .market-select {
            margin-left: 20px;
        }

        .init-db-btn {
            margin-left: 10px;
            width: 80px;
        }
    }

    .top-place-holder {
        position: static;
        height: 30px;
    }

    .stock-table {
        th, td
        {
            white-space: nowrap;
            padding: 3px;
        }
    }
}
</style>
