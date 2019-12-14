import Cookies from 'js-cookie'
import Errors from './errors'
import Vue from 'vue'
import queryString from 'querystring'

const state = {
  access_token: Cookies.get('access_token') || '',
  status: '',
  hasLoadedOnce: false,
  errors: new Errors()
}

const getters = {
  isAuthenticated: state => !!state.access_token,
  authStatus: state => state.status,
  authErrors: state => state.errors
}

const actions = {
  authRequest: ({commit, dispatch}, payload) => {
    let actionUrl = 'https://discordapp.com/api/oauth2/token'
    let data = {
      'client_id': payload.client_id,
      'client_secret': payload.client_secret,
      'grant_type': 'authorization_code',
      'code': payload.code,
      'redirect_uri': payload.redirect_uri
    }
    var options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    return new Promise((resolve, reject) => {
      commit('authRequest')
      Vue.axios.post(actionUrl, queryString.stringify(data), options)
        .then((resp) => {
          let accessToken = resp.data.token_type + ' ' + resp.data.access_token
          Cookies.set('access_token', accessToken)
          // Vue.axios.defaults.headers.common['Authorization'] = access_token

          commit('authSuccess', accessToken)
          dispatch('userRequest')
          resolve(accessToken)
        })
        .catch((err) => {
          commit('authError', err.response.data)
          Cookies.remove('access_token')
          reject(err)
        })
    })
  },
  authLogout: ({commit, dispatch}) => {
    Cookies.remove('access_token')
    return new Promise((resolve, reject) => {
      commit('authLogout')
      resolve()
    })
  }
}

const mutations = {
  authRequest: (state) => {
    state.status = 'loading'
  },
  authSuccess: (state, accessToken) => {
    state.status = 'success'
    state.access_token = accessToken
    state.hasLoadedOnce = true
  },
  authError: (state, err) => {
    let errors = err.errors ? err.errors : {}

    if (err.error === 'invalid_request') {
      errors.invalid_code = [err.error_description]
    }

    state.status = 'error'
    state.hasLoadedOnce = true
    state.errors.record(errors)
  },
  authLogout: (state) => {
    state.access_token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
