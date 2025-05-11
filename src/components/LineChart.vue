<template>
  <div id="canvas-container">
    <div class="chartWrapper" :style="{ height: store.chartHeight + 'vh' }">
      <div class="chart-settings-container" :class="store.showChartSettings ? 'expand' : ''">
        <LineChartSettings class="debug" :data="data" :options="options" @changeSettings="setLineChartData()"
          @resetZoom="resetZoom()"></LineChartSettings>
      </div>
      <button @click="update()">RESET</button>
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
const selectedColor = ref("#caafaf");

const canvas = ref(null);
const textDisplay = ref(null);
const lineChart = ref(null);
const scenes = ref(null);
const key = ref(0);
const localData = ref({}); // Crear un contenedor para la copia local de los datos
const data = ref({
  labels: ["1", "2", "3", "4", "5"], //escenas
  datasets: [
    {
      label: "Ventas 2024",
      data: [1, 2, 3],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4, // Controla la suavidad de la línea
    },
  ],
});

const opacity = ref(0);

/* const beforeEnter = (el) => {
  el.style.height = '0';
  el.style.opacity = '0';
};

const enter = (el, done) => {
  // Forzar el cálculo de la altura inicial correcta usando `getBoundingClientRect()`
  const initialHeight = el.getBoundingClientRect().height;
  el.style.transition = 'none'; // Desactivar transición temporalmente
  el.style.height = initialHeight + 'px'; // Establecer la altura inicial

  //el.offsetHeight; // Forzar un reflujo para que el navegador reconozca el cambio de estilo

  el.style.transition = 'all 0.5s ease'; // Volver a habilitar la transición
  el.style.height = el.scrollHeight + 'px'; // Aplicar la altura completa
  el.style.opacity = '1'; // Restaurar opacidad

  el.addEventListener('transitionend', done);
};

const leave = (el, done) => {
  el.style.transition = 'all 0.5s ease';
  el.style.height = '0';
  el.style.opacity = '0';
 // el.addEventListener('transitionend', done);
}; */
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
      annotations: {
        segment1: {
          type: "box",
          xMin: 0, // Comienza en el valor 0 del eje X
          xMax: 1, // Termina en el valor 1 del eje X
          backgroundColor: "rgba(255, 99, 132, 0.5)", // Aumenta la opacidad
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          name: "act1",
        },
        segment2: {
          type: "box",
          xMin: 1, // Comienza donde termina el primer segmento
          xMax: 2, // Termina en el valor 3 del eje X
          backgroundColor: "rgba(54, 162, 235, 0.25)", // Color diferente
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          name: "act2",
        },
        segment3: {
          type: "box",
          xMin: 2, // Comienza donde termina el segmento anterior
          xMax: 3,
          backgroundColor: "rgba(75, 192, 192, 0.25)", // Color diferente
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          name: "act3",
        },
        segment4: {
          type: "box",
          xMin: 3, // Comienza donde termina el segmento anterior
          xMax: 4,
          backgroundColor: "rgba(153, 102, 255, 0.25)", // Color diferente
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
          name: "act4",
        },
      },
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
const text = reactive({
  title: "",
  subtitle: "",
  description: "",
});
const { setLineChartData, updateHighlightOnly } = useLineChart(data, options, key, lineChart);


onMounted(() => {

});

const resetZoom = () => {
  lineChart.value.chart.resetZoom();
};
const update = () => {
  const chartInstance = lineChart.value?.chart;

  if (chartInstance && typeof chartInstance.update === 'function') {
    // ⚠️ Cambiar radicalmente los datos del primer dataset
    if (chartInstance.data.datasets.length > 0) {
      chartInstance.data.datasets[0].data = chartInstance.data.labels.map(() =>
        Math.floor(Math.random() * 12) // valores aleatorios de 0 a 11
      );
      chartInstance.data.datasets[0].borderColor = '#ff0000';
      chartInstance.data.datasets[0].backgroundColor = '#ff000030';
      chartInstance.data.datasets[0].label = '⚠️ Dataset modificado';
    }

    // ⚠️ También podemos añadir un dataset nuevo como prueba
    chartInstance.data.datasets.push({
      label: 'Nuevo dataset 🔥',
      data: chartInstance.data.labels.map(() => Math.floor(Math.random() * 12)),
      borderColor: '#00ff00',
      backgroundColor: '#00ff0030',
      tension: 0.3,
      fill: false,
      spanGaps: true
    });

    // ✅ Ejecutar update para refrescar el gráfico
  //  chartInstance.update();
    updateHighlightOnly(store.carouselSceneIndex);
    console.log("✅ Gráfico actualizado con nuevos datos");
  } else {
    console.warn("⚠️ El gráfico aún no está listo o no se puede actualizar.");
  }
};


const selectElement = (scene, act) => {
  text.subtitle = "";

  if (scene) {
    text.title = scene.title;
    text.description = scene.description;
    text.subtitle = act.title;
  } else {
    text.title = act.title;
    text.description = act.description;
  }
};

const handleShowLabels = () => {
  labelsSettings.showLabels = !labelsSettings.showLabels;
};

const updateScenes = () => {
  drawChart();
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
