import Vue from 'vue'
import Cookies from 'js-cookie'
const state = {
  status: '',
  user: '',
  profile: {}
}

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.name
}

const actions = {
  userRequest: ({commit, dispatch}) => {
    commit('userRequest')
    let accessToken = Cookies.get('access_token')
    Vue.axios.get('https://discordapp.com/api/users/@me', {headers: {authorization: accessToken}})
      .then((resp) => {
        state.user = resp.data
        Vue.axios.get('https://discordapp.com/api/users/@me/guilds', {headers: {authorization: accessToken}})
          .then((resp) => {
            commit('userSuccess', resp.data)
          })
      })
      .catch(() => {
        commit('userError')
        dispatch('authLogout')
      })
  }
}

const mutations = {
  userRequest: (state) => {
    state.status = 'loading'
  },
  userSuccess: (state, resp) => {
    var data = {
      user: state.user,
      guilds: resp
    }
    state.status = 'success'
    Vue.set(state, 'profile', data)
  },
  userError: (state) => {
    state.status = 'error'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
