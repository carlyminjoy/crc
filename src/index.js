import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify';

Vue.use(Vuetify)

const vuetify = new Vuetify({});

new Vue({
    render: h => h(App),
    vuetify,
}).$mount('#app')