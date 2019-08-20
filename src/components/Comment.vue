<template>
  <p class="comment" v-html='text'></p>
</template>

<script>
import { setTimeout } from 'timers';
let url = window.location.href;
let debug = url.match(/debug/g);
const timer = debug ? 1 : 1200;

export default {
  name: 'Comment',
  props: [
      'text'
  ],
  mounted() {
      let vm = this;
      vm.$emit('scrolltobottom')
  }
}
</script>