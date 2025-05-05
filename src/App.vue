<template>
  <Transition>
    <p v-if="store.showCarousel">
      <Carousel :initialSceneIndex="store.carouselSceneIndex" />
    </p>
  </Transition>
  <Transition>
    <p v-if="store.showGrid">
      <Grid />
    </p>
  </Transition>
  <div class="d-flex items-center justify-between">
    <div class="header d-flex items-center">
      <h1>Story Nest {{ store.carouselSceneIndex }}</h1>
      <small>v 1.2</small>
      <Navbar />
    </div>
  </div>

  <article class="chartContainer" style="display: flex; width: 100%">
    <div ref="editorRef" class="app-text-editor-container expand" :style="{ width: editorWidth + 'px' }">
      <TextEditor />
    </div>

    <!-- Resizer entre ambos -->
    <div class="resizer" @mousedown="startResize"></div>

    <div class="app-chart-container" :class="{ expand: store.showPlotChart }"
      :style="{ width: `calc(100% - ${editorWidth}px - 6px)` }">
      <LineChart />
    </div>
  </article>
<div :style="{position: 'absolute', bottom: '0', right: '0', border: '1px solid red', width: '200px', height: '200px'}">
  debug
  {{ store.carouselSceneIndex }}

  </div>
  

</template>

<script setup>
import { nextTick } from "vue";

import { ref, onMounted, reactive } from "vue";
import jsonStory from "./constants/story.json";
import TextEditor from "./components/TextEditor.vue";
import LineChart from "./components/LineChart.vue";
import { useSettingsStore } from "./stores/settings";
import CollapseButtons from "./components/CollapseButtons.vue";
import Navbar from "./components/Navbar.vue";
import Carousel from "./components/Carousel.vue";
import Grid from "./components/Grid.vue";

import TComponent from "./components/TComponent.vue";
//import jsonStory from './constants/uav.json'

const store = useSettingsStore();

const showEditor = ref(false);
const show = ref(false);

const editorRef = ref(null)
const editorWidth = ref(800) // ancho inicial en px
const isResizing = ref(false)

const startResize = (e) => {
  isResizing.value = true
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

const resize = (e) => {
  if (!isResizing.value) return
  editorWidth.value = e.clientX
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}

onMounted(() => {
  store.updateStory(jsonStory);
  store.addNumeration();
  store.addColorToActs();
  store.expandAllActs();
  store.checkCharactersInScene();
  // handleShowPlotChart();
});

const handleShowPlotChart = () => {
  // store.togglePlotChart();
};
const handleShowPieChart = () => {
  store.togglePieChart();
};

const handleShowEditor = () => {
  store.toggleEditor();
};
/* const importJSON = (event) => {
  const file = event.target.files[0]; // Tomar el primer archivo seleccionado
  if (file && file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        console.log(jsonData); // Aquí procesas el JSON como necesites
        processJSON(jsonData);
      } catch (error) {
        console.error("Error al parsear el archivo JSON", error);
      }
    };
    reader.readAsText(file); // Leer el archivo como texto
  } else {
    console.error("Por favor selecciona un archivo JSON válido.");
  }
};
const processJSON = (data) => {
  //store.togglePlotChart();
  store.updateStory(data);
  store.addColorToActs();
  //store.togglePlotChart();
};
const exportStoryAsJSON = () => {
  const json = JSON.stringify(store.story, null, 2); // Convierte el store a JSON
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${store.story.title}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Libera la URL creada
}; */
</script>
<style>
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
