<template>
  <div id="canvas-container">
    <div class="chartWrapper" :style="{ height: store.chartHeight + 'vh' }">
      <div class="chart-settings-container" :class="store.showChartSettings ? 'expand' : ''">

        <LineChartSettings class="debug" :data="data" :options="options" @changeSettings="setLineChartData()"
          @resetZoom="resetZoom()"></LineChartSettings>
      </div>
      <!--       <button @click="update()">RESET</button> -->
      <ChartTooltip class="tooltip" v-bind="selectionTooltip" />
      <ChartTooltip class="tooltip" v-bind="sceneTooltip" />
      <ChartTooltip class="tooltip" v-bind="hoveredSegmentTooltip" />
<p style="visibility: hidden;">1</p>
      <Line :data="data" :options="options" ref="lineChart" :key="lineKey" @mouseleave="handleMouseLeave" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch, computed,nextTick } from "vue";
import { Line, Pie } from "vue-chartjs";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";
import { useSettingsStore } from "../stores/settings";
import LineChartSettings from "./LineChartSettings.vue";
import ChartTooltip from "./Tooltip.vue";

import { useLineChart } from "../composables/useLineChart";


import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  annotationPlugin,
  zoomPlugin,
  ArcElement
);

const store = useSettingsStore();
const canvas = ref(null);
const lineChart = ref(null);
const scenes = ref(null);
/* remove */
const key = ref(0);
const data = ref({
  labels: [], //escenas
  datasets: [],
});
const lineKey = computed(() => {
  return store.triggerChangeKey;
});

// Opciones del gráfico con anotaciones
const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2, // Proporción 2:1 (ancho:alto)

  scales: {
    y: {
      beginAtZero: true, // Comenzar desde cero
      ticks: {
        stepSize: 1, // Incrementar de 1 en 1
        padding: 20, // Ajusta este valor para más o menos espacio
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)", // Color de las líneas de la cuadrícula
        lineWidth: 1,
      },
      min: 0, // Valor mínimo en el eje Y
      max: 10, // Valor máximo en el eje Y para mayor amplitud
    },
    x: {
      ticks: {
        maxRotation: 45, // Rotación máxima
        minRotation: 45, // Rotación mínima
        font: {
          size: 16,  // Ajusta el tamaño de la fuente para las etiquetas del eje X
        }
      },
    },
  },

  plugins: {
    legend: {
      display: true,
      position: 'top', // Cambia la posición de la leyenda

    },
    annotation: {
      annotations: {},
    },
    zoom: {
      limits: {
        y: { min: 0, max: 10 },
      },
      pan: {
        enabled: true,
      },
      zoom: {
        limits: {
          y: { min: 0, max: 10 },
        },
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: "xy",
      },
    },
  },
});

const { setLineChartData, createLabels, updateHighlightOnly, selectionTooltip, sceneTooltip, hoveredSegmentTooltip, updateChart, hideTooltips, createSegments, updateActLabelAnnotations, updateSceneLabels } = useLineChart(data, options, key, lineChart);


const resetZoom = () => {
  lineChart.value.chart.resetZoom();
};
onMounted(() => {
  updateChart()
});

function handleMouseLeave() {
  hideTooltips()
  // Aquí puedes ocultar tooltips, deseleccionar, etc.
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function sanitizeStory(story) {
  if (!story) return null;
  const clone = deepClone(story);

  clone.acts?.forEach((act) => {
    delete act.collapsed;
    act.scenes?.forEach((scene) => {
      delete scene.collapsed;
      delete scene.collapsedCarousel;
    });
  });

  return clone;
}
let previousSanitized = null;
watch(
  () => store.story,
  (newStory) => {
    const currentSanitized = sanitizeStory(newStory);

    const hasChanged = JSON.stringify(currentSanitized) !== JSON.stringify(previousSanitized);

    if (hasChanged && store.triggerChangeKey2 === 1) {
      previousSanitized = currentSanitized;
      console.log('CHANGE DETECTED IN LINE CHART', currentSanitized);
      setLineChartData();
      store.triggerChange2()
    }

  },
  { deep: true, immediate: true }
);

watch(
  () => store.triggerChangeKey,
  () => {

nextTick(() => {
    setLineChartData();

})


  },
  { deep: true, immediate: true }
);
function test() {
  //console.log('TEST', data.value.labels);
  //setLineChartData()
//  updateHighlightOnly()
}

function getSceneTitlesSnapshot(story) {
  return story?.acts?.flatMap(act =>
    act.scenes.map(scene => ({ id: scene.id, title: scene.title }))
  ) || [];
}


function hasSceneTitlesChanged(newStory, previousTitles) {
  const newTitles = getSceneTitlesSnapshot(newStory);
  const changed = JSON.stringify(newTitles) !== JSON.stringify(previousTitles);
  return { changed, newTitles };
}



function getActTitlesSnapshot(story) {
  return story?.acts?.map(act => act.title) || [];
}

function hasActTitlesChanged(newStory, previousActTitles) {
  const newActTitles = getActTitlesSnapshot(newStory);
  const changed = JSON.stringify(newActTitles) !== JSON.stringify(previousActTitles);
  return { changed, newActTitles };
}



function getStoryStructureSnapshot(story) {
  return {
    // El orden y la cantidad de actos
    actOrder: story.acts?.map(act => act.id || act.title) || [],

    // Para cada acto, el orden y cantidad de escenas
    scenesPerAct: story.acts?.map(act => ({
      id: act.id || act.title,
      sceneOrder: act.scenes.map(scene => scene.id || scene.title)
    })) || [],

    // El orden y cantidad de tramas
    plotOrder: story.plots?.map(plot => plot.id || plot.title) || []
  };
}


function hasStructureChanged(newStory, previousStructure) {
  const newStructure = getStoryStructureSnapshot(newStory);
  const changed = JSON.stringify(newStructure) !== JSON.stringify(previousStructure);
  debugger
  return { changed, newStructure };
}


let previousStructure = getStoryStructureSnapshot(store.story);
let previousSceneTitles = getSceneTitlesSnapshot(store.story);
let previousActTitles = getActTitlesSnapshot(store.story);

watch(
  () => store.story,
  (newStory) => {
    if (!data.value || !options.value || !store.storyIsSet) return;

    const sceneCheck = hasSceneTitlesChanged(newStory, previousSceneTitles);

    const actCheck = hasActTitlesChanged(newStory, previousActTitles);
    const structureCheck = hasStructureChanged(newStory, previousStructure);



    if (structureCheck.changed) {
      console.log("📊 Estructura cambiada → regenerar todo");
      previousStructure = structureCheck.newStructure;
      store.triggerChange()
      return;
    }

    if (sceneCheck.changed) {
      console.log("✏️ Título de escena cambiado → actualizar labels X");

      updateSceneLabels()

      previousSceneTitles = sceneCheck.newTitles;
      return;
    }


    if (actCheck.changed) {
      console.log("✏️ Título de acto cambiado → actualizar etiquetas de actos");
      updateActLabelAnnotations()
      previousActTitles = actCheck.newActTitles;
      return
    }



  },
  { deep: true }
);










</script>

<style>
.tooltip {
  background-color: var(--color-dark-bg);
  color: white;
  padding: 5px;
  border-radius: var(--border-radius);
  font-size: 12px;
  width: 200px;
  text-wrap: pretty;
  height: auto;
  padding: 1rem;
}

#canvas-container {
  width: 100%;
  /* Ancho total del contenedor */
  overflow-x: auto;
  /* Scroll horizontal */
  /*   border: 1px solid #ccc; */
}

.chartWrapper {
  /*  height: 2000px; */
  padding-top: 1rem
}

.chart-settings-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  opacity: 0;
  height: 0;
  transition: height 0.5s ease-in-out, opacity 0.5s ease-in-out;

}

.chart-settings-container.expand {

  opacity: 1;
  height: 200px;

}
</style>
