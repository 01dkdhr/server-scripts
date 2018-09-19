import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home-page',
            component: require('@/components/HomePage/index.vue').default
        },
        {
            path: '/node-stock',
            name: 'node-stock',
            component: require('@/components/NodeStock/index.vue').default
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})
