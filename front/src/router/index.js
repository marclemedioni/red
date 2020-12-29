import { createWebHistory, createRouter } from "vue-router";
import home from '@/components/index'
//import task from '@/components/task/task'
//import listCommands from '@/components/commands/list'
//import login from '@/components/login/login'

const routes = [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/task',
      name: 'task',
      component: home
    },
    {
      path: '/commands',
      name: 'commands',
      component: home
    },
    {
      path: '/account',
      name: 'Account',
      component: home
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;