<template>
  <section class="background">
  <div class="container">
  <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <router-link :to='{name:home}' class="navbar-item">
            <img src="./assets/img/discord-logo.svg" width="112" height="28">
          </router-link>
          <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-star"></div>
          <div class="navbar-end">
            <div class="navbar-item">
                <router-link :to="{ name: 'home' }" class="navbar-item">
                 Home
                </router-link>
                <router-link :to="{name:'commands'}" class="navbar-item">
                  Commands
                </router-link>
                <a class="navbar-item">
                  Documentation
                </a>
                <router-link :to="{name:'task'}" class="navbar-item">
                  Task
                </router-link>
                <div class="navbar-item has-dropdown is-hoverable" v-if="user">
                  <a class="navbar-link is-arrowless">
                    {{user.user.username}}
                  </a>
                  <div class="navbar-dropdown">
                    <router-link :to="{name: 'Account'}" class="navbar-item">
                      My account
                    </router-link>
                    <a class="navbar-item">
                      My logs
                    </a>
                    <hr class="navbar-divider">
                    <a class="navbar-item" @click="logOut()">
                      Log out
                    </a>
                  </div>
                </div>
                <a v-if="!user" href="https://discordapp.com/api/oauth2/authorize?client_id=321367990178152485&redirect_uri=http%2api%2Faccount&response_type=code&scope=identify%20guilds" class="navbar-item">
                  Login
                </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
    <router-view></router-view>
  </section>
</template>

<script>
export default {
  name: 'App',
}
</script>