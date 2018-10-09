<template>
<div id="app">
    stock detail
</div>
</template>

<script>
import { remote } from 'electron';
export default {
    name: 'stock-detail',
    data() {
        return {
            stock: null,
            dailyStocks: []
        }
    },
    created() {
        const window = remote.getCurrentWindow();
        if (window.extData) {
            window.extData.stock && (this.stock = window.extData.stock);
            window.extData.dailyStocks && (this.dailyStocks = window.extData.dailyStocks);
        }
    }
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
}
</style>