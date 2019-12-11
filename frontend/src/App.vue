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
                <a class="navbar-item">
                  Commands
                </a>
                <a class="navbar-item">
                  Documentation
                </a>
                <router-link :to="{name:'task'}" class="navbar-item">
                  Task
                </router-link>
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
  name: 'App'
}
</script>
