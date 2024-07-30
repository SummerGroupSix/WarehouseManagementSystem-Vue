import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '../views/UserLogin.vue'
import UserIndex from '../views/index/UserIndex.vue'
import roleList from '../views/index/roleList.vue'
import permList from '../views/index/permList.vue'
import userList from '../views/index/userList.vue'
import HomePage from '@/views/index/HomePage.vue'
import depotList from '../views/index/depotList.vue'
import productList from '../views/index/productList.vue'
import depotStorage from '../views/index/depotStorage.vue'

Vue.use(VueRouter)

const routes = 
[
  // {
  //   path: '/Sys',
  //   name: 'start',
  //   redirect: userList
  // },
  {
    path: '/',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/Sys',
    name: 'UserIndex',
    redirect:'/Sys/home',
    component: UserIndex,
    children:[
      {
        path: 'home',
        name: 'HomePage',
        component: HomePage
      },
      {
        path: 'userList',
        name: 'userList',
        component: userList
      },
      {
        path: 'roleList',
        name: 'roleList',
        component: roleList
      },
      {
        path: 'permList',
        name: 'permList',
        component: permList
      },
      {
        path: 'depotList',
        name: 'depotList',
        component: depotList
      },
      {
        path: 'productList',
        name: 'productList',
        component: productList
      },
      {
        path: 'depotStorage/:id',
        name: 'depotStorage',
        component: depotStorage,
      }
    ]
  },
]
  
  

const router = new VueRouter({
  history: history,
  routes
})

export default router
