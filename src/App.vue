<template>
  <div class="d-flex items-center justify-between">
    <div class="header d-flex items-center">
      <h1>Story Nest</h1>
      <small>v 1.2</small>
    </div>
    <div class="d-flex justify-center items-center settings">
      <button @click="handleShowEditor">
        {{ store.showEditor ? "Hide" : "Show" }} Editor
      </button>
      <button @click="store.togglePlotChart()">
        {{ store.showPlotChart ? "Hide" : "Show" }} Plot Chart
      </button>
      <button @click="store.toggleShowChartSettings()">
        {{ store.showChartSettings ? "Hide" : "Show" }} Chart Settings
      </button>
      <button @click="store.toggleShowCarousel()">
        {{ store.showCarousel ? "Hide" : "Show" }} Scene Carousel
      </button>
    </div>
    <div>
      <button @click="exportStoryAsJSON">Exportar JSON</button>
      <button class="custom-file-upload">
        <label for="file-upload" class="custom-button">Importar json</label>
        <input
          type="file"
          id="file-upload"
          @change="importJSON"
          accept=".json"
        />
      </button>
    </div>
  </div>

  <article class="chartContainer">
    <div
      class="app-chart-container"
      :class="store.showPlotChart ? 'expand' : ''"
    >
      <LineChart />
    </div>
    <div
    class="app-carousel-container"
    :class="store.showCarousel ? 'expand' : ''"
    >
      <CollapseButtons mode="carousel" />
      <SceneCarousel></SceneCarousel>
    </div>

      <div
        class="app-text-editor-container"
        :class="store.showEditor ? 'expand' : ''"
      >
        <CollapseButtons />
        <TextEditor></TextEditor>
      </div>
  </article>
</template>

<script setup>
import { nextTick } from "vue";

import { ref, onMounted, reactive } from "vue";
import jsonStory from "./constants/story.json";
import TextEditor from "./components/TextEditor.vue";
import LineChart from "./components/LineChart.vue";
import { useSettingsStore } from "./stores/settings";
import SceneCarousel from "./components/SceneCarousel.vue";
import CollapseButtons from "./components/CollapseButtons.vue";
import TComponent from "./components/TComponent.vue";
//import jsonStory from './constants/uav.json'

const store = useSettingsStore();

const showEditor = ref(false);

onMounted(() => {
  store.updateStory(jsonStory);
  store.addNumeration();
  store.addColorToActs();
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
const importJSON = (event) => {
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
};
</script>
<style>
.app-text-editor-container {
  transition: height 0.5s ease-in-out, opacity 0.5s ease-in-out;
  opacity: 0;
  height: 0;
  overflow: hidden;
}

.app-text-editor-container.expand {
  opacity: 1;
  height: 1000px;
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
  height: 500px;
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
