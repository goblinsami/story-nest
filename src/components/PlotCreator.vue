<script setup>
import {ref} from "vue";
import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();

const newPlot = ref({title: 'New Plot'})


</script>

<template>
  <div class="container">
    <textarea  name="plot-name" v-model="newPlot.title"></textarea>
    <button @click="store.createPlot(newPlot.title)">Crear</button>
  </div>

      <div v-for="(plot, index) in store.story.plots" class="plot-container">
       <input type="text" v-model="plot.title" class="plotName">
                 <input
            type="color"
            :id="actIndex"
            name="head"
            v-model="store.plotColorsHard[index]"
            class="plot-color-sample"
          />
       <button @click="store.deletePlot(index)">X</button>
      </div>
</template>
<style>


.container {
  padding: 1rem 0;
  display: flex;
}
.plot-container {
  display: flex;
}
.plotName {
  border: 1px black solid;
  padding: 0.5rem;
}
</style>
