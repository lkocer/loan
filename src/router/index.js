import Vue from 'vue';
import Router from 'vue-router';
// import index from '@/components/list/list';//列表
// import detail from '@/components/detail/detail';//详情
const index = () => import('@/components/list/list');
const detail = () => import(/* webpackChunkName: "group-foo" */  '@/components/detail/detail.vue');

Vue.use(Router)

export default new Router({
  mode:'history',//history hash
  routes: [
    {
        path:'/',
        redirect:'/list/hot'
    },
    {
        path:'/list',
        redirect:'/list/hot'
    },
    {
      path: '/list/:listName',
      name: 'list',
      component: index
    },
    {
      path: '/list/:listName/detail',
      name: 'detail',
      component: detail
    }
    // {
    //   path: '/apple',
    //   name: 'ApplePage',
    //   component: Apple,
    //   children:[
    //      {
    //       path: 'red/:id',
    //       name: 'redApplePage',
    //       component: redApple
    //      }
    //   ]
    // }
  ]
});

