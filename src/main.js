import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

Vue.use(ElementUI);
Vue.config.productionTip = false;

//定义全局axios对象
Vue.prototype.$axios = axios;

//请求baseURL
axios.defaults.baseURL = ('http://localhost:8088');

/* 设置cookie,session跨域配置 */
axios.defaults.withCredentials=true;

//拦截器
axios.interceptors.request.use(
  config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    if(sessionStorage.getItem("token") != null){
      config.headers["Authorization"] = sessionStorage.getItem("token");
    }
    return config;
  },
  // config => {
  //   if (sessionStorage.getItem("token") != null) {
  //     config.headers["Authorization"] = sessionStorage.getItem("token");
  //   }
  //   return config;
  // },)
  err => Promise.reject(err)
)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
