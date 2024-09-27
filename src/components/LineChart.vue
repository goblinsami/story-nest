<template>
  <div id="canvas-container">
    <article class="styleControls">
      {{ labelsSettings }}
      <br />

      <label for="position">X</label>
      <input
        name="position"
        type="range"
        v-model="labelsSettings.top"
        @input="updateScenes()"
        min="-100"
        max="100"
      />
      <label for="position">Y</label>
      <input
        name="position"
        type="range"
        v-model="labelsSettings.left"
        @input="updateScenes()"
        min="-100"
        max="100"
      />
      <label for="position">Rotation</label>
      <input
        name="rotation"
        type="range"
        v-model="labelsSettings.rotation"
        @input="updateScenes()"
        min="-180"
        max="180"
      />
      <input
        name="fontSize"
        type="range"
        v-model="labelsSettings.fontSize"
        @input="updateScenes()"
        min="1"
        max="56"
      />
    </article>

    <div class="chartCanvas" ref="canvas" id="canvas"></div>
    <div ref="textDisplay" id="textDisplay">
      <h2>{{ text.title }}</h2>
      <h3>{{ text.description }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import jsonStory from "../constants/story.json";

const canvas = ref(null);
const textDisplay = ref(null);

const text = reactive({
  title: "sd",
  description: "23",
});

const labelsSettings = reactive({
  top: 120,
  left: -20,
  rotation: 45,
  fontSize: 12,
});

const { story } = defineProps({
  story: {
    required: true,
  },
});
const colors = [
  "rgba(255, 99, 132, 0.5)", // Color 1
  "rgba(54, 162, 235, 0.5)", // Color 2
  "rgba(255, 206, 86, 0.5)", // Color 3
  "rgba(75, 192, 192, 0.5)", // Color 4
  "rgba(153, 102, 255, 0.5)", // Color 5
  "rgba(255, 159, 64, 0.5)", // Color 6
];
onMounted(() => {
  drawChart();
});

const drawChart = () => {
  canvas.value.innerHTML = ""; // Limpiar el contenido

  let actsLength = jsonStory.acts.length; // Número de actos
  console.log(actsLength);

  // Limpiamos el contenido del canvas antes de añadir nuevos elementos
  canvas.value.innerHTML = "";
  const acts = jsonStory.acts; // Obtenemos los actos desde el JSON

  // Creamos las divisiones (segmentos) lineales
  acts.forEach((act, index) => {
    let segment = document.createElement("div");
    segment.setAttribute("id", index);
    segment.classList.add("segment");
    segment.style.backgroundColor = colors[index % colors.length];

    // Crear el contenido dinámico para cada segmento (actos y escenas)
    let scenesHTML = ``;

    act.scenes.forEach((scene) => {
      console.log(scene.title);
      let sceneContainer = document.createElement("div");
      sceneContainer.classList.add("sceneContainer");

      let sceneElement = document.createElement("span");
      sceneElement.classList.add("scene");
      sceneElement.textContent = scene.title;

      sceneElement.style.position = "relative";
      sceneElement.style.fontSize = `${labelsSettings.fontSize}px`; // P

      sceneElement.style.top = `${labelsSettings.top}px`; // Posición Y
      sceneElement.style.left = `${labelsSettings.left}px`; // Posición X
      sceneElement.style.transform = `rotate(${labelsSettings.rotation}deg)`; // Rotación

      sceneContainer.addEventListener("click", () => {
        text.value = scene.title + scene.description;
      });

      sceneContainer.appendChild(sceneElement);

      segment.appendChild(sceneContainer);
    });


    canvas.value.appendChild(segment); // Añadir cada segmento al canvas
  });
};

const updateScenes = () => {
  drawChart();
};

watch(
  labelsSettings,
  () => {
    drawChart();
  },
  { deep: true }
);
</script>

<style>
#textDisplay {
  border: 1px rgb(255, 0, 0) solid;
  height: 100px;
}
.styleControls {
  padding: 1rem;
  border: 1px black solid;
}

.styleControls input {
  border: 1px black solid !important;
}
.sceneContainer {
  border-left: 5px black dotted;
  display: flex;
}
.scene {
  transform: rotate(45deg);
  white-space: nowrap;
  height: auto;
  position: relative;
  top: 120px;
  left: -20px;
}
#canvas-container {
  width: 100%; /* Ancho total del contenedor */
  height: 100%; /* Altura fija para hacer scroll */
  overflow-x: auto; /* Scroll horizontal */
  border: 1px solid #ccc; /* Borde opcional para distinguir el área */
}
.chartCanvas {
  height: 300px; /* Altura fija para hacer scroll */

  display: flex; /* Flexbox para distribuir los segmentos horizontalmente */
  justify-content: space-between; /* Espaciado entre segmentos */
  overflow-x: auto; /* Scroll horizontal */
}
.line {
  border-top: 1px black solid;
}

.segment {
  flex: 1; /* Hacer que cada segmento ocupe el mismo ancho */
  height: 1px; /* Altura de la línea */
  background-color: black;
  position: relative;
  text-align: center;
  height: 60px;
  display: flex;
  justify-content: space-between;
}

.segment p {
  position: absolute;
  top: -20px; /* Posiciona el texto por encima de la línea */
  width: 100%;
  margin: 0;
  font-size: 12px;
  text-align: center;
  color: black;
}
</style>
