<template>
  <div class="box is-black">
  <article class="media">
    <div class="media-left">
      <figure class="image is-64x64">
        <img :src="data.user.avatar" alt="Image" class="is-rounded">
      </figure>
    </div>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{data.user.username}}</strong> <small>@{{data.message.guild}}</small> <small>{{ date }}</small>
          <br>
          <strong>Command</strong> : {{data.command}}
           <br>
          <span v-for="(key, pattern) in data.message.pattern" v-bind:key="pattern"><strong>{{ pattern }}</strong> : {{key}}<br></span>
          <strong>Content</strong> : {{data.message.content}}
        </p>
      </div>
    </div>
  </article>
</div>
</template>
<script>
import moment from 'moment'
export default {
    props: ["data"],
    computed: {
        date: function () {
            return moment( this.data.message.timeStamp).format('MMMM D YYYY, H:mm');
        }
}   

};
</script>