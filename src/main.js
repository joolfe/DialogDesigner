import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/fontawesome/css/fontawesome-all.css'
import App from './App.vue'
import ToggleButton from 'vue-js-toggle-button'
import fontawesome from '@fortawesome/fontawesome'
import { faAddressCard } from '@fortawesome/fontawesome-free-regular'

fontawesome.library.add(faAddressCard)


Vue.use(ElementUI)
Vue.use(ToggleButton)


new Vue({
  el: '#app',
  render: h => h(App)
})
