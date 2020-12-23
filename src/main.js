import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(ElementUI);
Vue.use(VueCodemirror);

Vue.config.productionTip = false




// Axios.defaults.baseURL = "/server/index.php?s=/"
Axios.defaults.baseURL = "https://www.showdoc.com.cn/server/index.php?s=/"
// Axios.defaults.baseURL = "http://156.96.148.124:89"
// Axios.defaults.baseURL = "http://" + window.location.host
// Axios.defaults.baseURL = "http://juzi.shengtaiyuan.xyz:90/"
Axios.defaults.timeout = 10000
Axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
Axios.defaults.headers.delete['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// Axios.defaults.withCredentials = true
// Axios.withCredentials = true;
// Axios.defaults.withCredentials = true;
Axios.interceptors.request.use(
    config => {
        // 允许携带cookie
        config.withCredentials = true
        if (!config.data){
            config.data = {};
        }

        let userStr = localStorage.getItem("login_user");
        if (userStr){
            const userToken = JSON.parse(userStr).user_token;
            config.data['user_token'] = userToken
        }

        let result = '';
        for(let key in config.data) {
            if(config.data.hasOwnProperty(key)) {
                let tmp = `&${key}=${config.data[key]}`;
                result += tmp;
            }
        }
        result = result.substring(1);
        config.data = result;
        return config
    },
    error => {
      return Promise.error(error)
    }
)

// 响应拦截
// 响应拦截器
Axios.interceptors.response.use(
    response => {
      if (response.status === 200) {
          if (response.data.error_code === 10102){
              router.replace({
                  path: '/login'
              })
          }else if (response.data.error_code !== 0){
              console.log(response.data)
          }
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response.data)
      }
    },
    // 服务器状态码不是200的情况
    error => {
      if (error.response.status) {
        // error.response.data = JSON.parse(error.response.data)
        if (error.response.status === 401) {
          router.replace({
            path: '/login'
          })
        } else if (error.response.status === 400) {
          if (error.response.data.message === '未抢到') {
            return Promise.reject(error.response.data)
          }
          if (error.response.data.message.indexOf("当前时间段不能") !== -1) {
            return Promise.reject(error.response.data)
          }
          const msg = error.response.data.message;
          console.log(msg)
          // Toast.fail(msg);
        } else if (error.response.status === 403){
          console.log("您无权访问该内容")
          // Toast.fail("您无权访问该内容");
        } else {
          console.log("网络错误，请稍后再试")
          // Toast.fail("网络错误，请稍后再试");
        }
        return Promise.reject(error.response.data)
      }
    }
)
Vue.prototype.ser = Axios
Vue.prototype.ser.ctx = Axios.defaults.baseURL
Vue.prototype.uuid = () => {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}
/*3.用正则表达式实现html编码（转义）*/
Vue.prototype.htmlEncode = (str) => {
    let temp = "";
    if(str.length === 0) return "";
    temp = str.replace(/&/g,"&amp;");
    temp = temp.replace(/</g,"&lt;");
    temp = temp.replace(/>/g,"&gt;");
    temp = temp.replace(/\s/g,"&nbsp;");
    temp = temp.replace(/\'/g,"&#39;");
    temp = temp.replace(/\"/g,"&quot;");
    return temp;
},
/*4.用正则表达式实现html解码（反转义）*/
    Vue.prototype.htmlDecode = (str) => {
    let temp = "";
    if(str.length === 0) return "";
    temp = str.replace(/&amp;/g,"&");
    temp = temp.replace(/&lt;/g,"<");
    temp = temp.replace(/&gt;/g,">");
    temp = temp.replace(/&nbsp;/g," ");
    temp = temp.replace(/&#39;/g,"\'");
    temp = temp.replace(/&quot;/g,"\"");
    return temp;
},


Array.prototype.indexOf = function(val) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    let index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
