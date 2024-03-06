import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Search from '@/views/search'
import Searchlist from '@/views/search/list'
import Pay from '@/views/pay'
import MyOrder from '@/views/myorder'
import ProDetail from '@/views/prodetail'

import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'
import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/search', component: Search },
    { path: '/searchlist', component: Searchlist },
    // 动态路由传参，确认将来是哪个商品，路由传参中携带id
    { path: '/prodetail/:id', component: ProDetail },
    { path: '/pay', component: Pay },
    { path: '/myorder', component: MyOrder }
  ]
})

// 全局前置导航守卫
// to：到哪去，
// from： 从哪里来
// next()： 是否放行
// （1）next() 直接放行，放行到to要去的路径
//  (2) next() 进行拦截，拦截到next里面配置的路径

// 定义一个数组，专门用于存放所有需要权限访问的页面
const qx = ['/pay', '/myorder']

// 非权限页面直接放行
router.beforeEach((to, from, next) => {
  if (!qx.includes(to.path)) {
    next()
    return
  }

  // 是权限页面需判断token
  const token = store.getters.token
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
