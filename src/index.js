import Vue from 'vue'
import App from './App.vue'

import 'classlist-polyfill'

new Vue({
  render: h => h(App),
}).$mount('#app')
