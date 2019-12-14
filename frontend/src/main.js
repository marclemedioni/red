// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {store} from './vuex/store'

Vue.use(VueAxios, axios)
Vue.use(require('vue-moment'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  created () {
    if (this.$store.getters.isAuthenticated) {
      this.$store.dispatch('userRequest')
    }
  },
  router,
  store,
  components: { App },
  template: '<App/>'
})
