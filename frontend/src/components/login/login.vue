<template>
    <section style="margin-top:3rem">
        <div class="container">
            <article class="message is-danger" v-if="authErrors.has('invalid_code')">
                <div class="message-body">
                    <div v-text="authErrors.get('invalid_code')"></div>
                </div>
            </article>
            <div class="columns is-vcentered">
                 <div class="column is-one-quarter ">
                    <figure class="image is-96x96 center">
                        <img :src="'https://cdn.discordapp.com/avatars/'+user.user.id+'/'+user.user.avatar+'.png'" alt="avatar" class="is-rounded" v-if="user.user.avatar">
                        <img :src="'https://cdn.discordapp.com/avatars/'+user.user.discriminator+'.png'" alt="avatar" class="is-rounded" v-else>
                    </figure>

                </div>
                <div class="column">
                    <div class="card carte ">
                        <div class="table-container">
                            <table class="table table is-fullwidth is-narrow">
                                <tr>
                                    <td>Id</td>
                                    <td>{{user.user.id}}</td>
                                </tr>
                                <tr>
                                    <td>Username</td>
                                    <td>{{user.user.username}}</td>
                                </tr>
                                <tr>
                                    <td>Name</td>
                                    <td>{{user.user.username}}#{{user.user.discriminator}}</td>
                                </tr>
                                <tr>
                                    <td>Premium</td>
                                    <td>
                                        <div class="control">
                                            <div class="tags has-addons">
                                            <span class="tag is-dark">Type</span>
                                            <span class="tag is-discord" v-if="user.user.prenium === 1">Nitro Classic</span>
                                            <span class="tag is-discord" v-if="user.user.prenium === 2">Nitro</span>
                                             <span class="tag is-discord" v-if="!user.user.prenium">None</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" style="margin-top:2rem">
          <div class="card carte ">
            <div class="tabs">
              <ul>
                  <li v-bind:class="{'is-active':type === 'guilds'}">
                      <a>
                          <span class="icon is-small"><i class="fas fa-server" aria-hidden="true"></i></span>
                          <span>Guilds</span>
                      </a>
                  </li>
              </ul>
          </div>
          <div class="columns is-multiline ">
            <div class="column is-6" v-for="(guild, index) in user.guilds" :key="index">
              <article class="media">
                <figure class="media-left">
                  <p class="image is-64x64">
                    <img :src="'https://cdn.discordapp.com/icons/'+guild.id+'/'+guild.icon+'.png'" class="is-rounded" v-if="guild.icon">
                    <img :src="'https://via.placeholder.com/64/2c2f33/FFFFFF?text='+initial(guild.name)" class="is-rounded" v-else>
                  </p>
                </figure>
                <div class="media-content">
                  <div class="content">
                    <p>
                      <strong class="is-white is-border-bottom is-uppercase">
                        <span class="icon is-small is-gold" v-if="guild.owner"><i class="fas fa-crown"></i></span>
                        {{guild.name}}
                      </strong>
                      <br>
                      <span class="tags">
                        <span class="tag is-discord" v-for="(f, index) in guild.features" :key="index">
                        {{f}}
                        </span>
                      </span>
                    </p>
                  </div>
                  <nav class="level is-mobile">
                        <div class="columns is-multiline">
                          <div class="column is-1 center" v-for="(perm, index) in perm(guild.permissions)" :key="index">
                            <span class="icon is-gold" >
                              <i class="fas" v-bind:class="perm.logo" :title="perm.name"></i>
                            </span>
                          </div>
                        </div>
                  </nav>
              </div>
              <div class="media-right">
                <b v-if="red(guild.id).length !== 0">
                  <figure class="media-left">
                    <p class="image is-16x16">
                      <img src="../../../static/img/red.png" class="is-rounded">
                    </p>
                  </figure>
                </b>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { permission } from '../../vuex/modules/permission'
export default {
  name: 'login',
  data () {
    return {
      client_id: '321367990178152485',
      client_secret: 'phYzsB2sy9RlSuhXvck3slaP0KiKtTLr',
      redirect_uri: 'http://localhost:8080/account',
      grant_type: 'authorization_code',
      scope: 'identify guilds',
      token: Object,
      type: 'guilds',
      guilds: ''

    }
  },
  watch: {
    token () {
      if (this.token.access_token) {
        this.getAccount(this.token.token_type, this.token.access_token)
      }
    }
  },
  computed: {
    authErrors () {
      return this.$store.getters.authErrors
    },
    user () {
      if (this.$store.getters.isAuthenticated) {
        return this.$store.getters.getProfile
      } else {
        if (this.$route.query.code) {
          this.login(this.$route.query.code)
        }
      }
    }
  },
  methods: {
    login (code) {
      var data = {
        'client_id': this.client_id,
        'client_secret': this.client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': this.redirect_uri
      }
      this.$store.dispatch('authRequest', data)
        .then((response) => {
        })
    },
    initial (str) {
      var tab = []
      var name = str.toLowerCase().split(' ')
      if (name.length > 1) {
        name.map((word) => {
          tab.push(word[0].toUpperCase())
        })
      } else {
        tab.push(name[0][0].toUpperCase() + name[0].substr(1))
      }
      return tab.join('')
    },
    perm (value) {
      return permission(value)
    },
    getGuilds () {
      this.axios.get(`${process.env.API_RED_URI}/guilds`).then((response) => {
        this.guilds = response.data.guilds
      })
    },
    red (guild) {
      return this.guilds.filter((obj) => {
        if (obj.id === guild) {
          return true
        } else {
          return false
        }
      })
    }

  },
  mounted () {
    this.getGuilds()
  },
  Destroy () {

  }
}
</script>
