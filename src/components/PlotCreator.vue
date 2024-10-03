<script setup>
import {ref} from "vue";
import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();

const newPlot = ref({title: 'New Plot'})
const plotColorsHard = ref([
  "#FF5733", // Rojo anaranjado
  "#33FF57", // Verde lima
  "#3357FF", // Azul
  "#F1C40F", // Amarillo
  "#9B59B6", // Púrpura
  "#E67E22", // Naranja
  "#2ECC71", // Verde esmeralda
  "#3498DB", // Azul claro
  "#E74C3C", // Rojo
  "#1ABC9C", // Verde aguamarina
  "#8E44AD", // Púrpura oscuro
  "#F39C12", // Amarillo anaranjado
  "#D35400", // Naranja oscuro
  "#2C3E50", // Azul oscuro
  "#ECF0F1", // Gris claro
  "#95A5A6", // Gris
  "#7F8C8D", // Gris oscuro
]);

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
