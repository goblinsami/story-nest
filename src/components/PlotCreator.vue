<script setup>
import { ref } from "vue";
import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();

const newPlot = ref({ title: 'New Plot' })


</script>

<template>
  <div class="container">
    <textarea name="plot-name" v-model="newPlot.title" class="plotName"></textarea>
    <button @click="store.createPlot(newPlot.title)">Crear</button>
  </div>

  <div v-for="(plot, index) in store.story.plots" class="plot-container w-100">
    <textarea v-model="plot.title" class="plotName"></textarea>
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
  background-color: var(--color-dark-bg) !important;
  background: none;
  width: 100%;
}

.plot-container {
  display: flex;
}

.plotName {
  border: 1px black solid;
  padding: 0.5rem;
  background: none;
  color: var(--color-light-text) !important;
  border: 1px var(--color-light-text) solid!important;
    width: 100%;


}
</style>
