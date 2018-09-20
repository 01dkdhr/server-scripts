<template>
<div id="node-stock">
    <div class="tool-bar">
        <span class="db-state" 
            :class="[stateData.dbInited ? 'success' : 'fail']">
            {{stateData.dbInited ? '数据加载成功' : '数据未加载'}}
        </span>
    </div>
    <div class="top-place-holder"></div>
</div>
</template>

<script>
import { ipcRenderer } from 'electron';
import service from './js/service.js';
export default {
    name: 'node-stock',
    data() {
        return {
            
        }
    },
    computed: {
        stateData() {
            return this.$store.state.NodeStock;
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
            })
            .catch((err) => {
                console.log('asyncLoadData err:', err)
            });
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

        .init-db-btn {
            margin-left: 10px;
            width: 80px;
        }
    }

    .top-place-holder {
        position: static;
        height: 30px;
    }
}
</style>
