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

      <!--       <div v-if="selectionTooltip.visible" class="tooltip" :style="{
        position: 'absolute',
        left: `${selectionTooltip.x}px`,
        top: `${selectionTooltip.y}px`,

      }">
        {{ selectionTooltip.data }}
      </div> -->

      <!--       {{ sceneTooltip }}
      //
     {{ selectionTooltip }} -->


      <Line :data="data" :options="options" ref="lineChart" :key="key" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
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


// Opciones del gráfico con anotaciones
const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 0.5, // Proporción 2:1 (ancho:alto)

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
      annotations: { },
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

const { setLineChartData, updateHighlightOnly, selectionTooltip, sceneTooltip, hoveredSegmentTooltip } = useLineChart(data, options, key, lineChart);

const update = () => {

  /*   const chart = lineChart.value.chart;
    chart.tooltip.setActiveElements(
    [{ datasetIndex: 0, index: 2 }],
    {
      x:  chart.scales.x.getPixelForValue(11),
      y:  chart.scales.y.getPixelForValue( chart.data.datasets[0].data[2])
    }
  ); */

/*   options.value.plugins.tooltip = {
    enabled: true,
    callbacks: {
      title: (tooltipItems) => {
        const item = tooltipItems[0];
        const sceneIndex = item.dataIndex;
        const scenes = store.story.acts.flatMap(act => act.scenes);
        const scene = scenes[sceneIndex];
        return `${sceneIndex + 1}: ${scene?.title || 'Sin título'}`;
      },
      label: (tooltipItem) => {
        const scenes = store.story.acts.flatMap(act => act.scenes);
        const scene = scenes[tooltipItem.dataIndex];
        const intensity = tooltipItem.raw !== null ? `Intensidad: ${tooltipItem.raw}` : null;
        const characters = scene?.characters?.length
          ? `Personajes: ${scene.characters.join(', ')}`
          : null;

        return [intensity, characters].filter(Boolean); // Devuelve array si hay más de una línea
      }
    }
  }; */


/* chart.update('none');
 */};


const resetZoom = () => {
  lineChart.value.chart.resetZoom();
};


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

    if (hasChanged) {
      previousSanitized = currentSanitized;
      console.log('CHANGE DETECTED IN LINE CHART', currentSanitized);
      setLineChartData();
    }
  },
  { deep: true, immediate: true }
);
/* watch(
  () => store.colorsHard, // Observa cambios en toda la historia
  () => {

    setLineChartData(); // Actualiza el gráfico
  },
  { deep: true },
); */
watch(
  () => store.carouselSceneIndex,
  (newVal, oldVal) => {
    if (newVal === oldVal || newVal == null) return;
    updateHighlightOnly(newVal);
  }
);

watch(
  () => store.darkMode,
  () => {
    setLineChartData();
  }
);
/* watch(
  () => store.chartFontSize, // Observa cambios en toda la historia
  () => {

    setLineChartData(); // Actualiza el gráfico
  },
  { deep: true },
); */
/* watch(
  () => store.plotColorsHard, // Observa cambios en toda la historia
  () => {

    setLineChartData(); // Actualiza el gráfico
  },
  { deep: true },
); */

</script>

<style>
.tooltip {
  background-color: var(--color-dark-bg);
  color: white;
  padding: 5px;
  border-radius: var(--border-radius);
  font-size: 12px;
  z-index: 1000;
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
