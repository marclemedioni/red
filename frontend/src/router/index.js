import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/HelloWorld'
import task from '@/components/task/task'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/task',
      name: 'task',
      component: task
    }
  ]
})
