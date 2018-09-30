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
            <input type="radio" id="group-date" v-model="date.dateGroup.mode" value="group" @click="changeDateMode('group')">
            <span>起始时间:</span>
            <select :disabled="date.dateGroup.mode !== 'group'" v-model="date.dateGroup.startDate">
                <option v-for="(date, index) in stateData.dateArray" :value="date" :key="index">{{date | dateString}}</option>
            </select>
            <span>截止时间:</span>
            <select :disabled="date.dateGroup.mode !== 'group'" v-model="date.dateGroup.endDate">
                <option v-for="(date, index) in endTimeList" :value="date" :key="index">{{date | dateString}}</option>
            </select>
        </div>
        <div class="date-area">
            <input type="radio" id="single-date" v-model="date.dateSingle.mode" value="single" @click="changeDateMode('single')">
            <span>单一时间:</span>
            <select :disabled="date.dateGroup.mode !== 'single'" v-model="date.dateSingle.date">
                <option v-for="date in stateData.dateArray" :value="date" :key="date">{{date | dateString}}</option>
            </select>
        </div>
        <!-- 市场选择 -->
        <div class="market-select">
            <span>市场:</span>
            <select v-model="market.mode">
                <option v-for="(mode, index) in market.list" :value="mode" :key="index">{{mode}}</option>
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
            date: {
                dateGroup: {
                    startDate: 0,
                    endDate: 0,
                    mode: 'single'
                }, 
                dateSingle: {
                    date: 0,
                    mode: 'single'
                },  
            },
            market: {
                list: ['all', 'sh', 'sz'],
                mode: 'all'    
            },
            tableHeader: defaultTableHeader,
            sortKeys: [] // 排序字段
        }
    },
    computed: {
        endTimeList() {
            if (this.date.dateGroup.startDate) {
                const index = this.stateData.dateArray.indexOf(this.date.dateGroup.startDate);
                if (index >= 0) {
                    
                    const arr = this.stateData.dateArray.slice(0, index + 1);
                    if (arr.indexOf(this.date.dateGroup.endDate) < 0) {
                        this.date.dateGroup.endDate = arr[0];    
                    }

                    return arr;
                }
                
            }
            return this.stateData.dateArray; 
        },
        stateData() {
            return this.$store.state.NodeStock;
        },
        stockFilter() {
            const filter = {};
            if (this.date.dateGroup.mode == 'group') {
                filter.startDate = this.date.dateGroup.startDate;
                filter.endDate = this.date.dateGroup.endDate;
            } else if (this.date.dateGroup.mode == 'single') {
                filter.startDate = filter.endDate = this.date.dateSingle.date;
            }

            return filter;
        },
        showStocks() {
            const list = [];
            this.stateData.stocks.forEach((stock) => {
                if (this.market.mode !== 'all' && stock.market !== this.market.mode) {
                    return;
                }

                const item = {
                    stockName: stock.stockName,
                    fullStockCode: stock.fullStockCode    
                };

                if (this.date.dateSingle.mode == 'single') {
                    const dailyStock = _.find(this.stateData.dailyStocks, { 
                        fullStockCode: stock.fullStockCode,
                        dateTime: this.date.dateSingle.date
                    }); 
                    
                    if (dailyStock) {
                        Object.assign(item, dailyStock);
                        list.push(item);
                    }
                } else if (this.date.dateGroup.mode == 'group') {
                    const dailyStocks = _.filter(this.stateData.dailyStocks, (e) => {
                        return ((e.fullStockCode == stock.fullStockCode) 
                            && (e.dateTime >= this.date.dateGroup.stateData) 
                            && (e.dateTime <= this.date.dateGroup.endDate));
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
            .then(({ stocks, dateArray }) => {
                this.$store.commit('SET_STOCKS', stocks);
                this.$store.commit('SET_DATE_ARRAY', dateArray);
                this.$store.commit('SET_DB_INITED', true);   
                
                this.date.dateGroup.startDate = this.stateData.dateArray[this.stateData.dateArray.length - 1];
                this.date.dateGroup.endDate = this.stateData.dateArray[0];
                this.date.dateSingle.date = this.date.dateGroup.endDate;
            })
            .catch((err) => {
                console.log('asyncLoadData err:', err)
            });
        },
        changeDateMode(mode) {
            this.date.dateGroup.mode = mode;
            this.date.dateSingle.mode = mode;
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
    filters: {
        dateString: (date) => {
            return TimeUtil.transDateToString(date);
        }
    },
    watch: {
        stockFilter: function(newValue) {
            service.loadDailyStockData(newValue)
            .then(({ dailyStocks }) => {
                this.$store.commit('SET_DAILY_STOCKS', dailyStocks);
            });
        }
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

        * {
            vertical-align: middle;
        }

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
