<template>
    <section>
        <div class="container is-black box" style="margin-top:2rem">
            <b class="title">Send Message</b>
            <form v-on:submit.prevent="formulaire()">
                <div class="columns">
                    <div class="column">
                        <div class="field">
                            <label class="label">Guilds</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="selectGuild">
                                        <option v-for="(guild, key) in guilds" v-bind:key="key" :value="guild.id" >{{guild.name}}</option>
                                        <option value="ooo">Choose your Guild</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column" >
                        <div class="field" v-show="listeChannel.length >= 1">
                            <label class="label">{{listeChannel.length}} Channels</label>
                            <div class="control">
                                <div class="select">
                                    <select v-model="selectChannel">
                                        <option v-for="(channel, key) in listeChannel" :key="key" :value="channel.id">{{channel.name}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Message</label>
                    <div class="control">
                        <textarea class="textarea" placeholder="Your message" v-model="text"></textarea>
                    </div>
                </div>
                <div class="field">
                  <progress class="progress is-small is-primary" max="100" v-if="sync">15%</progress>
                  <div class="control has-text-right">
                    <button class="button is-validate-discord" v-if="!sync">Send Message</button>
                  </div>
                </div>
            </form>
        </div>
    </section>
</template>
<script>
export default {
  name: 'task',
  data () {
    return {
      text: '',
      guilds: Array,
      channels: Array,
      users: String,
      timer: Number,
      time: 0,
      sync: false,
      selectGuild: 'ooo',
      selectChannel: null,
      listeChannel: []
    }
  },
  watch: {
    selectGuild () {
      this.listeChannel = []
      if (this.selectGuild !== 'ooo') {
        this.channels.forEach((item) => {
          if (item.guild.id === this.selectGuild) {
            this.listeChannel.push({id: item.id, name: item.name})
          }
        })
        this.selectChannel = this.listeChannel[1].id
      }
    }
  },
  methods: {
    getGuilds () {
      this.axios.get(`${process.env.API_RED_URI}/guilds`).then((response) => {
        this.guilds = response.data.guilds
        this.channels = response.data.channels
      })
    },
    formulaire () {
      this.sync = true
      const {selectGuild, selectChannel, text} = this
      if (selectGuild !== 'ooo') {
        if (selectChannel != null) {
          if (text !== '') {
            this.axios.post(`${process.env.API_RED_URI}/message`, {selectGuild, selectChannel, text}).then((response) => {
              this.sync = false
              this.text = ''
            })
          } else {
            this.sync = false
          }
        } else {
          this.sync = false
        }
      } else {
        this.sync = false
      }
    }

  },
  mounted () {
    this.getGuilds()
  },
  Destroy () {

  }
}
</script>
