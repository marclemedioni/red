<template>
    <section class="background-hard">
        <div class="container" style="margin-top:7rem">
            <form v-on:submit.prevent="formulaire()">
                <div class="field">
                <label class="label">Guilds</label>
                <div class="control">
                    <div class="select">
                    <select v-model="selectGuild">
                        <option v-for="(guild, key) in guilds" v-bind:key="key" :value="guild.id" >{{guild.name}}</option>
                        <option value="ooo">With options</option>
                    </select>
                    </div>
                </div>
                </div>
                <div class="field">
                <label class="label">Channels</label>
                <div class="control">
                    <div class="select">
                    <select v-model="selectChannel">
                        <option v-for="(channel, key) in listeChannel" :key="key" :value="channel.id">{{channel.name}}</option>
                    </select>
                    </div>
                </div>
                </div>
                <div class="field">
                <label class="label">Message</label>
                <div class="control">
                    <textarea class="textarea" placeholder="Textarea" v-model="text"></textarea>
                </div>
                </div>
                <div class="field is-grouped">
                <div class="control">
                <button class="button is-link">Submit</button>
                </div>

                </div>
            </form>
        </div>
    </section>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
        text:"",
      guilds: Array,
      channels: Array,
      users: String,
      timer: Number,
      time: 0,
      selectGuild:'ooo',
      selectChannel:null,
      listeChannel:[]
    }
  },
  watch: {
      selectGuild(){
         
          if(this.selectGuild != 0){
              this.channels.forEach((item) => {
                  if(item.guild.id === this.selectGuild){
                      this.listeChannel.push({id:item.id, name:item.name})
                  }
              })
          }
      }
  },
  methods: {
    getGuilds () {
        this.axios.get('http://localhost:7000/guilds').then((response) => {
            this.guilds = response.data.guilds
            this.channels = response.data.channels
        }).catch((error) => {
            
        })
    },
    formulaire () {
        const {selectGuild, selectChannel, text} = this
        this.axios.post('http://localhost:7000/message', {selectGuild, selectChannel, text}).then((response) => {
            
        }).catch((error) => {
            
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
