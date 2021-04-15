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
                <div class="column is-three-quarters">
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
            </div>
        </div>
    </section>
</template>
<script>
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

  methods: {
    getComands () {
      this.axios.get(`/api/commands`).then((response) => {
        this.groups = response.data.groups
        this.commands = response.data.commands
        this.prefix = response.data.prefix
      })
    },
  },
  mounted () {
    this.getComands()
  }
}
</script>
