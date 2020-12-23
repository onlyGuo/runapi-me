import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/home')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('../views/test')
    },{
        path: '/login',
        component: () => import('../views/login')
    },{
        path: '/home',
        component: () => import('../views/home')
    },{
        path: '/project/:itemId',
        name: 'project',
        component: () => import('../views/project')
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

export default router
