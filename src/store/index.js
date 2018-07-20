/*
* @Author: lanyang
* @Date:   2018-07-05 09:26:15
* @Last Modified by:   lanyang
* @Last Modified time: 2018-07-05 09:29:30
*/
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
export default new Vuex.Store({
    state:{
      totalPrice:0
    },
    getters:{
      getTotal:state => state.totalPrice
    },
    mutations:{//必须同步操作
      increment(state,price){
           state.totalPrice += price;
      },
      decrement(state,price){
           state.totalPrice -= price;
      },
      multiply(state,price){
         state.totalPrice *= price;
      }
    },
    actions:{
      increase(context,price){//可以异步访问后台取数据再触发操作
        context.commit('multiply',price);
      }
    }
});