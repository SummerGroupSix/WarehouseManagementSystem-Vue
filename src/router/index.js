import Vue from 'vue'
import VueRouter from 'vue-router'
import UserLogin from '../views/UserLogin.vue'
import UserIndex from '../views/index/UserIndex.vue'
import roleList from './roleList.vue'
import permList from '../views/index/permList.vue'
import userList from '../views/index/userList.vue'

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
    redirect:'/Sys/userList',
    component: UserIndex,
    children:[
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
      }
    ]
  },
]
  
  

const router = new VueRouter({
  history: history,
  routes
})

export default router
