<template>
<button @click="handleShowEditor">{{showEditor ? 'Hide': 'Show'}} Editor</button>
<article class="chartContainer">
  <LineChart :story="story"></LineChart>

</article>
<main id="mainContainer">
  <TextEditor :story="story" v-if="showEditor"></TextEditor>
</main>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import jsonStory from './constants/story.json'
import TextEditor from "./components/TextEditor.vue";
import LineChart from "./components/LineChart.vue";
const showEditor = ref(false)
const story = reactive({})

onMounted(() => {
  Object.assign(story, jsonStory); // Actualiza las propiedades del objeto reactivo
})


const handleShowEditor = () => {
  showEditor.value = !showEditor.value
}
</script>

<style scoped>
.chartContainer {
}
</style>
