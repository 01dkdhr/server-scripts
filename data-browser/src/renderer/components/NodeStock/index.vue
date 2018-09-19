<template>
<div id="node-stock">
    <div class="tool-bar">
        <span class="db-state" 
            :class="[stateData.dbInited ? 'success' : 'fail']">
            {{stateData.dbInited ? '初始化成功' : '数据未初始化'}}
        </span>
        <button class="init-db-btn">载入数据</button>
    </div>
    <div class="top-place-holder"></div>
</div>
</template>

<script>
export default {
    name: 'node-stock',
    data() {
        return {
            stateData: this.$store.state.NodeStock
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
