<template>
  <div class="home-body">
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
                <p class="title">{{uptime}}</p>
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
  name: 'HelloWorld',
  data () {
    return {
      guilds: String,
      channels: String,
      users: String,
      uptime: String
    }
  },
  mounted () {
    this.guilds = '???'
    this.channels = '???'
    this.users = '???'
    this.uptime = '???'
  }
}
</script>
