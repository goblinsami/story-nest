<template>
<button @click="handleShowEditor">{{store.showEditor ? 'Hide': 'Show'}} Editor</button>
<button @click="handleShowPlotChart">{{store.showPlotChart ? 'Hide': 'Show'}} Plot Chart</button>
<!-- <button @click="handleShowPieChart">{{store.showPieChart ? 'Hide': 'Show'}} Pie Chart</button> -->


<article class="chartContainer">
  <LineChart v-if="store.showPlotChart"></LineChart>
  <TextEditor v-if="store.showEditor && store.story"></TextEditor>
  <PieChart :story="story" v-if="store.showPieChart"></PieChart>
</article>
<main id="mainContainer">
</main>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
//import jsonStory from './constants/story.json'
import jsonStory from './constants/uav.json'

import TextEditor from "./components/TextEditor.vue";
import LineChart from "./components/LineChart.vue";
import { useSettingsStore } from "./stores/settings";
import PieChart from "./components/PieChart.vue";

const store = useSettingsStore();
const showEditor = ref(false)
//const story = reactive({})

onMounted(async () => {
  // Espera a que el updateStory complete su tarea
  await store.updateStory(jsonStory);
  // Emitir un evento o realizar cualquier otra acción después de que el story esté cargado
});
const loadStoryToStore = () => {
  store.updateStory(jsonStory)

}
const handleShowPlotChart = () => {
  store.togglePlotChart();

}
const handleShowPieChart = () => {
  store.togglePieChart();

}

const handleShowEditor = () => {
  store.toggleEditor();
}
</script>

<style scoped>
.chartContainer {
}
</style>
