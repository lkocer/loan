/*
* @Author: lanyang
* @Date:   2018-07-04 13:52:37
* @Last Modified by:   lanyang
* @Last Modified time: 2018-07-19 16:55:54
*/
import Vue from 'vue';
import qs from 'qs';
import './lib/flexible.js';
import 'muse-ui/lib/styles/base.less';
import {
  AppBar,
  BottomNav,
  Button,
  Dialog,
  Grid
} from 'muse-ui';
import 'muse-ui/lib/styles/theme.less';
import { Swipe, SwipeItem} from 'mint-ui';
import axios from 'axios';
import VueCookies from 'vue-cookies'
import App from './pages/index';
import router from './router/index.js';
Vue.prototype.$ajax = axios;
if (process.env.NODE_ENV !== 'development'){//区分dev还是build
 Vue.prototype.$httpPort = '';
} else {
 Vue.prototype.$httpPort = '';
}

Vue.use(AppBar);
Vue.use(BottomNav);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Grid);
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);

Vue.use(VueCookies);
Vue.use(router);

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el,{value}) {//事件插入的时候
    // 聚焦元素
     if (value) {
        el.focus();
    }
  },
  update: function (el, {value}) {//数据有改变的时候
    if (value) {
      el.focus()
    }
  }
})

Vue.directive('numberOnly', {
    bind: function(el) {
        el.handler = function() {
            el.value = el.value.replace(/\D+/, '')
        }
        el.addEventListener('input', el.handler)
    },
    unbind: function(el) {
        el.removeEventListener('input', el.handler)
    }
});

Vue.directive('clickoutside', {
 // 初始化指令
  bind(el, binding, vnode) {
    function documentHandler(e) {
  // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
            return false;
      }
  // 判断指令中是否绑定了函数
      if (binding.expression) {
  // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value();
      }
 }
 // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.vueClickOutside = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {},
  unbind(el, binding) {
 // 解除事件监听
    document.removeEventListener('click', el.vueClickOutside);
    delete el.vueClickOutside;
  }
})

axios.interceptors.request.use(function (config) {//axios 将传递的json数据转为form data
    if(config.method!='get'){
        config.data=qs.stringify(config.data);
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    return config;
},function (error) {
    return Promise.reject(error)
});
 
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    return Promise.reject(error);
});

Vue.config.productionTip = false;//设置为 false 以阻止 vue 在启动时生成生产提示。
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
