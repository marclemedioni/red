import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/HelloWorld'
import task from '@/components/task/task'
import listCommands from '@/components/commands/list'
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
    },
    {
      path: '/commands',
      name: 'commands',
      component: listCommands
    }
  ]
})
