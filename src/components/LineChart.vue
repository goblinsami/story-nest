<template>
  <div id="canvas-container">
    <div class="chartWrapper" :style="{ height: store.chartHeight + 'vh' }">
      <div class="chart-settings-container" :class="store.showChartSettings ? 'expand' : ''">
        <LineChartSettings class="debug" :data="data" :options="options"@changeSettings="setLineChartData()" @resetZoom="resetZoom()"></LineChartSettings>
      </div>

<br>
<br>

<h1>
</h1>
      <Line
        :data="data"
        :options="options"
        ref="lineChart"
        :key="key"
      />
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
      max: 11, // Valor máximo en el eje Y para mayor amplitud
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
        y: { min: 0, max: 11 },
      },
      pan: {
        enabled: true,
      },
      zoom: {
        limits: {
          y: { min: 0, max: 11 },
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


onMounted(() => {
  setLineChartData();
});

const resetZoom = () => {
  lineChart.value.chart.resetZoom();
};
/* const handleClick = (event, chart) => {
  const chartInstance = lineChart.value.chart; // Acceder a la instancia del gráfico
  const { x } = event; // Obtiene la posición x del clic
  const xScale = chartInstance.scales.x; // Escala del eje X

  // Verificar en qué segmento ocurrió el clic
  const annotations = chartInstance.options.plugins.annotation.annotations;

  for (const annotation of Object.values(annotations)) {
    const xMin = chartInstance.scales["x"].getPixelForValue(annotation.xMin);
    const xMax = chartInstance.scales["x"].getPixelForValue(annotation.xMax);

    if (x >= xMin && x <= xMax) {
      // El clic ocurrió dentro de este segmento
      text.title = annotation.title;
    }
  }
  chartInstance.data.labels.forEach((label, index) => {
    const xPosition = xScale.getPixelForValue(index); // Obtener la posición de la etiqueta en el eje X

    // Definir un rango de tolerancia para detectar el clic cerca de la etiqueta
    const tolerance = 5; // Ajustar según sea necesario
    if (x >= xPosition - tolerance && x <= xPosition + tolerance) {
      text.title = label;
    }
  });
}; */
const setLineChartData = () => {
  console.log("setLineChartData");

  //comprobara si la data está definida
  if (!store.story || !store.story.acts) {
    console.error("Story o acts no están definidos aún.");
    return;
  }

  const acts = store.story.acts; // Usar la copia local de los actos

  const scenes = [];
  const segments = [];
  const plotData = {}; // Objeto para almacenar los datos de cada trama
  let maxPlotNumber = 0; // Para determinar cuántas tramas distintas hay
  let startX = 0;

  // Recorrer actos
  acts.forEach((act, actIndex) => {
    const segmentLength = act.scenes.length;

    let color = act.color;
    // Crear los segmentos
    const segment = {
      xMin: startX,
      xMax: startX + segmentLength,
      backgroundColor: color + "30",
      borderColor: color + "99",
      borderWidth: 1,
      title: act.title,
      type: "box",
    };
    segments.push(segment);

    // Recorrer escenas
    act.scenes.forEach((scene) => {
      //crea las labels del eje X
      scenes.push({
        title: scene?.title,
        act: act?.title,
      });
      maxPlotNumber = store.story.plots.length;
      // Recorrer las tramas en la escena y actualizar el plotData
      scene?.plots.forEach((plot) => {
        maxPlotNumber = Math.max(maxPlotNumber, plot); // Determinar el número máximo de tramas
        if (!plotData[plot]) plotData[plot] = []; // Crear array para la trama si no existe
        plotData[plot].push(scene.intensity); // Añadir intensidad a la trama
      });

      // Para las tramas que no están en la escena, añadir `null`
      for (let i = 1; i <= maxPlotNumber; i++) {
        if (!scene?.plots.includes(i)) {
          if (!plotData[i]) plotData[i] = []; // Crear array si aún no existe
          plotData[i].push(null); // Añadir `null` si no está presente en la escena
        }
      }
    });

    // Actualizar el valor inicial para el próximo segmento
    startX += act.scenes.length;

   // key.value++;
  });

  // Crear datasets dinámicos basados en el número de tramas
  const datasets = [];
  if (store.story.plots.length > 0){
    for (let i = 1; i <= maxPlotNumber; i++) {
      let color = store.plotColorsHard[i - 1];

      datasets.push({
        label: store.story.plots[i - 1].title,
        data: plotData[i], // Usar los datos de la trama correspondiente
        backgroundColor: color + "30",
        borderColor: color + "99",
        borderWidth: 2,
        fill: false, // No rellenar debajo de la línea
        tension: 0.4,
        spanGaps: true, // Permitir saltar puntos nulos
      });
    }
  } else {
    datasets.push(    {
      label: "",
      data: [],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      tension: 0.4, // Controla la suavidad de la línea
    },)
  }

    // Actualizar los datos del gráfico
    data.value.datasets = datasets;
    data.value.labels = scenes.map((el, index) => `${index + 1} - ${el.title}`);
    options.value.plugins.annotation.annotations = segments;
    options.value.scales.x.ticks.font.size = store.chartFontSize

console.log(store.chartFontSize)
  key.value++;
  }

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

watch(
  () => store.story, // Observa cambios en toda la historia
  (newStory) => {
    if (newStory) {
//      localData.value = { ...newStory }; // Copiar los datos del store a localData
      console.log('CHANGE DETECTED IN LINE CHART')
      setLineChartData(); // Actualiza el gráfico
    }
  },
  { deep: true },
  { immediate: true } // Necesario para observar objetos anidados como escenas
);
watch(
  () => store.colorsHard, // Observa cambios en toda la historia
  () => {

    setLineChartData(); // Actualiza el gráfico
  },
  { deep: true },
);
watch(
  () => store.chartFontSize, // Observa cambios en toda la historia
  () => {

    setLineChartData(); // Actualiza el gráfico
  },
  { deep: true },
);
watch(
  () => store.plotColorsHard, // Observa cambios en toda la historia
  () => {

      setLineChartData(); // Actualiza el gráfico
    },
  { deep: true },
);

</script>

<style>
#canvas-container {
  width: 100%; /* Ancho total del contenedor */
/*   height: 100%;  */
  overflow-x: auto; /* Scroll horizontal */
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

.chart-settings-container.expand{

  opacity: 1;
  height: 200px;

}

</style>
