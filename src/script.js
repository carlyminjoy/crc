import Vue from 'vue'
import { default as ttform } from './components/form.vue'

new Vue({
    el: '#tt-app',
    render: h => h(ttform)
})
