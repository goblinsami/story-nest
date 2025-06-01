<template>
  <div class="d-flex items-center justify-between">
    <div class="header d-flex items-center">
      <h1>Story Nest </h1>
      <small>v 1.2</small>
      <h5><strong>{{ store.story.title }}</strong></h5>
      <Navbar />
    </div>
  </div>

  <article class="chartContainer" style="display: flex; width: 100%">
    <div ref="editorRef" class="app-text-editor-container expand" :style="{ width: editorWidth + 'px' }"
      v-if="!store.textEditorIsDettached && store.textEditorPosition === positions.LEFT">
      <TextEditor/>
    </div>


    <DragModal class="drag-modal" v-bind="dragModalSettings" v-if="store.textEditorIsDettached">
      <TextEditor/>
    </DragModal>

    <!-- Resizer entre ambos -->
    <div class="resizer" @mousedown="startResize"
      v-if="!store.textEditorIsDettached && store.textEditorPosition === positions.LEFT"></div>

    <div v-if="store.storyIsSet" class="app-chart-container" :class="{ expand: store.showPlotChart }"
      :style="{ width: `calc(100% - ${editorWidth}px - 6px)` }">
      <LineChart />
    </div>
    <div class="resizer" @mousedown="startResize"
      v-if="!store.textEditorIsDettached && store.textEditorPosition === positions.RIGHT"></div>

    <div ref="editorRef" class="app-text-editor-container expand" :style="{ width: editorWidth + 'px' }"
      v-if="store.textEditorPosition === positions.RIGHT">

      <TextEditor/>

    </div>


  </article>
  <Debugger v-if="store.showDebugger" />


</template>

<script setup>
import { nextTick } from "vue";

import { ref, onMounted, reactive, computed } from "vue";
import jsonStory from "./constants/story.json";
import TextEditor from "./components/TextEditor.vue";
import LineChart from "./components/LineChart.vue";
import { useSettingsStore } from "./stores/settings";
import CollapseButtons from "./components/CollapseButtons.vue";
import Navbar from "./components/Navbar.vue";
import Carousel from "./components/Carousel.vue";
import Grid from "./components/Grid.vue";
import Debugger from "./components/Debugger.vue";
import DragModal from "./components/DragModal.vue";
import 'vue-draggable-resizable/style.css';
//import jsonStory from './constants/uav.json'
import { positionsConstants } from "./constants/positions";

const positions = computed(() => {
  return positionsConstants();
});
const store = useSettingsStore();
const showEditor = ref(false);
const show = ref(false);
const dragModalSettings = ref({
  w: 350,
  h: 917/2 ,
  x: 1600/3 + 350,
  y: 0,
  maximixed: false,
  minimized: false,
});
const editorRef = ref(null)
//const editorWidth = ref(350) // ancho inicial en px
const isResizing = ref(false)
let editorWidth = computed(() => {

  return store.editorWidth
});


function minimizeModal() {
  dragModalSettings.value.minimized = true;
  dragModalSettings.value.maximized = false;

  const padding = 20;
  const modalWidth = 300;
  const modalHeight = 100;

  // Asumimos que el modal se posiciona en base a la ventana
  const windowWidth = window.innerWidth;

  dragModalSettings.value.w = modalWidth;
  dragModalSettings.value.h = modalHeight;
  dragModalSettings.value.x = windowWidth - modalWidth - padding;
  dragModalSettings.value.y = padding;
}
function maximizeModal() {
  dragModalSettings.value.maximized = true;
  dragModalSettings.value.minimized = false;
  dragModalSettings.value.x = 0;
  dragModalSettings.value.y = 0;
  dragModalSettings.value.w = window.innerWidth;
  dragModalSettings.value.h = window.innerHeight;
}

const startResize = (e) => {
  isResizing.value = true
  console.log('START RESIZE', store.textEditorPosition)
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}
const resize = (e) => {
  if (!isResizing.value) return;

  if (store.textEditorPosition === positions.value.LEFT) {
    store.editorWidth = e.clientX;
  } else if (store.textEditorPosition === positions.value.RIGHT) {
    const totalWidth = window.innerWidth;
    store.editorWidth = totalWidth - e.clientX;
  }
};

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}

const init = async () => {
  console.log('INIT')
  await store.toggleDarkMode();
  await store.loadStory(jsonStory);
  await store.addNumeration();
  await store.addColorToActs();
  await store.expandAllActs();
  await store.checkCharactersInScene();
  await store.toggleShowCarousel();
  store.storyIsSet = true;
  store.triggerChange2()

};

onMounted(async () => {
  await init()
});



</script>
<style>
.drag-modal {
  position: absolute;
  z-index: 9000;

}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s linear
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.resizer {
  width: 6px;
  cursor: ew-resize;
  background: #ccc;
  height: 100vh
}

.app-text-editor-container {
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  overflow-y: scroll;
}

.app-text-editor-container.expand {
  opacity: 1;
  max-height: 93vh;
}

.app-carousel-container {
  transition: height 0.5s ease-in-out, opacity 0.5s ease-in-out;
  opacity: 0;
  height: 0;
}

.app-carousel-container.expand {
  opacity: 1;
  height: 350px;
}

.app-chart-container {
  transition: height 0.5s ease-in-out, opacity 0.5s ease-in-out;
  overflow: hidden;
  opacity: 0;
  height: 0;
}

.app-chart-container.expand {
  opacity: 1;
  height: 100%;
}

.header h1 {
  padding-right: 1rem;
  margin: 0;
}

.header small {
  padding: 0 1rem;
}

.custom-file-upload {
  margin-left: 10px;
}
</style>
