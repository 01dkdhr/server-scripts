import Vue from 'vue'

import StockDetail from './StockDetail.vue'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { StockDetail },
  template: '<StockDetail/>'
}).$mount('#app')