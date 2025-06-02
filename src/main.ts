//@ts-nocheck
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import VueDraggableResizable from 'vue-draggable-resizable'
import { VueDraggableNext } from "vue-draggable-next";
import Button from "./components/Button.vue";
import { Icon } from '@iconify/vue';

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.component("VueDraggableResizable", VueDraggableResizable)
app.component("Draggable", VueDraggableNext)
app.component("Icon", Icon)
app.component("Button", Button).mount('#app')
