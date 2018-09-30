import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home-page',
            component: require('@/components/HomePage/HomePage.vue').default
        },
        {
            path: '/node-stock',
            name: 'node-stock',
            component: require('@/components/NodeStock/NodeStock.vue').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
