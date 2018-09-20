import { ipcRenderer } from 'electron';
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

ipcRenderer.on('log-store', () => {
    console.log(store.state);
})

ipcRenderer.on('app-menu-goto-homepage', () => {
    router.push({
        path: '/',
        replace: false
    })
})
