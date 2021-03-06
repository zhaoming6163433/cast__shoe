import Vue from 'vue'
import Router from 'vue-router'
import home from '@/view/home'//首页路由
import castshoe from '@/view/castshoe'
import room from '@/view/room'

Vue.use(Router)

export default new Router({
  routes: [
    /*{ path: '*', component: NotFoundComponent },//404页面*/
    {//首页
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/castshoe',
      name: 'castshoe',
      component: castshoe
    },
    {
        path: '/room',
        name: 'room',
        component: room
      }
  ]
})
