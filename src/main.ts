//@ts-nocheck
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import VueDraggableResizable from 'vue-draggable-resizable'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.component("vue-draggable-resizable", VueDraggableResizable).mount('#app')
