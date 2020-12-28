<template>
  <div class="home-body background-red">
    <div class="container has-text-centered">
      <div class="logo"></div>
      <div class="informations">
        <h2 class="title is-2">Blue is dead, long live Red !  </h2>
        <div class="info">
          <nav class="level" style="margin-top: 2em;">
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Guilds</p>
                <p class="title">{{guilds}}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Channels</p>
                <p class="title">{{channels}}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Users</p>
                <p class="title">{{users}}</p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p class="heading">Uptime</p>
                <p class="title">{{getUptime(time)}}</p>
              </div>
            </div>
          </nav>
          <div style="margin-top:3rem">
          <a href="/invite" class=" button is-info is-inverted " style="background-color: #ffbebb00; color: #ffffff; border-color: white;">
            <span>Invite Red To Your Server</span>
          </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      guilds: String,
      channels: String,
      users: String,
      timer: Number,
      time: 0
    }
  },
  methods: {
    getClient () {
      this.axios.get(`/api/client`).then((response) => {
        this.guilds = response.data.guilds
        this.channels = response.data.channels
        this.users = response.data.users
        this.time = response.data.uptime
      }).catch((error) => {
        if (!error.status) {
          this.guilds = '-'
          this.channels = '-'
          this.users = '-'
          this.time = 0
        }
      })
    },
    getUptime (duration) {
      var seconds = Math.floor((duration / 1000) % 60)
      var minutes = Math.floor((duration / (1000 * 60)) % 60)
      var hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
      hours = (hours < 10) ? '0' + hours : hours
      minutes = (minutes < 10) ? '0' + minutes : minutes
      seconds = (seconds < 10) ? '0' + seconds : seconds
      return hours + ':' + minutes + ':' + seconds
    },
    cancelAutoUpdate () { clearInterval(this.timer) }

  },
  mounted () {
    this.getClient()
    this.guilds = '-'
    this.channels = '-'
    this.users = '-'
    this.timer = setInterval(() => this.getClient(), 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
    this.cancelAutoUpdate()
  }
}
</script>
