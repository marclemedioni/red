<template>
    <section>
        <div class="main" style="margin-top:2rem">
            <div class="columns is-multiline is-mobile">
                <div class="column is-one-quarter">
                    <div class="card carte sticky">
                        <aside class="menu">
                            <p class="menu-label">
                                Commands
                            </p>
                            <ul class="menu-list">
                                <li>
                                    <a class="tablinks" v-for="(group, key) in groups" :key="key" v-bind:class="{'is-active':select === group.id }" @click="select = group.id">
                                    {{group.name}}
                                    </a>
                                </li>

                            </ul>
                        </aside>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="tabcontent" style="display: block;" v-for="(command, key) in commands" :key="key" v-show="select === command.groupID">
                        <div class="card card-command">
                            <header class="card-header">
                                <p class="card-header-title">
                                    <code>{{prefix}}{{command.name}}</code>
                                </p>
                                <div class="card-header-icon">
                                    <span class="tag is-success is-pulled-right" v-if="command.ownerOnly">ADMINISTRATOR</span>
                                    <span class="tag is-discord is-pulled-right" v-if="command.guildOnly">SERVER ONLY</span>
                                </div>
                            </header>
                            <div class="card-content card-content-command">
                                <div class="content">
                                    {{ command.description}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-one-quarter">
                    <div class="tabcontent" style="display: block;" v-for="(noti, key) in notifications" :key="key">
                        <div class="card card-command">
                            <header class="card-header">
                                <p class="card-header-title">
                                    <span class="tag is-success" style="margin-right:0.50rem" v-bind:class="{'is-danger':noti.etat !== 'Success'}">{{noti.etat}}</span>
                                    <code style="margin-right:0.50rem">{{noti.message.guild}}</code>
                                    <code>{{noti.command}}</code>
                                </p>
                                <div class="card-header-icon is-pulled-right is-white">
                                    <figure class="image is-24x24">
                                        <img class="is-rounded" :src="noti.user.avatar" alt='avatar'>
                                    </figure>
                                    <b style="margin-left:0.50rem;" class="is-capitalized">{{noti.user.username}}</b>
                                </div>
                            </header>
                            <div class="card-content card-content-command">
                                <div class="content">
                                    <p>
                                         {{noti.message.content}}
                                    </p>
                                    <span class="is-pulled-right is-grey"><small>{{noti.message.timeStamp |moment("D/M/YY, h:mm:ss")}}</small></span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>
<script>
import io from 'socket.io-client'
export default {
  name: 'list',
  data () {
    return {
      groups: Array,
      Commands: Array,
      prefix: String,
      select: 'commands',
      notifications: []
    }
  },
  watch: {
    notifications () {
      if (this.notifications.length >= 5) {
        console.log('sup')
        this.notifications.splice(1, 1)
      }
    }
  },
  methods: {
    getComands () {
      this.axios.get(`/api/commands`).then((response) => {
        this.groups = response.data.groups
        this.commands = response.data.commands
        this.prefix = response.data.prefix
      })
    },
    listen () {
      var socket = io('/api')
      socket.on('event', (data) => {
        this.notifications.push(data)
      })
    }

  },
  mounted () {
    this.getComands()
    this.listen()
  }
}
</script>
