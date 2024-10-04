<template>
  <div class="header">
    <div style="display: flex; align-items: center">
      <h1>Story Nest</h1>
      <small>v 1.1</small>
      <button @click="handleShowEditor">
        {{ store.showEditor ? "Hide" : "Show" }} Editor
      </button>
      <button @click="handleShowPlotChart">
        {{ store.showPlotChart ? "Hide" : "Show" }} Plot Chart
      </button>
      <button @click="store.toggleShowChartSettings()">
        {{ store.showPlotChart ? "Hide" : "Show" }} Chart Settings
      </button>
      <button @click="store.toggleShowCarousel()">
        {{ store.showCarousel ? "Hide" : "Show" }} Scene Carousel
      </button>
    </div>
    <div>
      <button @click="exportStoryAsJSON">Exportar JSON</button>
      <input type="file" @change="importJSON" accept=".json" />
    </div>
  </div>

  <article class="chartContainer">
    <LineChart v-if="store.showPlotChart"></LineChart>
    {{ store.showCarousel }}
    <SceneCarousel v-if="store.story && store.showCarousel"></SceneCarousel>
    <TextEditor v-if="store.showEditor && store.story"></TextEditor>
  </article>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import jsonStory from "./constants/story.json";
import TextEditor from "./components/TextEditor.vue";
import LineChart from "./components/LineChart.vue";
import { useSettingsStore } from "./stores/settings";
import SceneCarousel from "./components/SceneCarousel.vue";
//import jsonStory from './constants/uav.json'

const store = useSettingsStore();

const showEditor = ref(false);

onMounted(() => {
  store.updateStory(jsonStory);
  store.addNumeration();
});

const handleShowPlotChart = () => {
  store.togglePlotChart();
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
  store.updateStory(data);
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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h1 {
  padding-right: 1rem;
  margin: 0;
}

.header small {
  padding-right: 1rem;
}
</style>
