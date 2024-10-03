<template>
  <div id="canvas-container">
    <article class="styleControls">
      <div class="chartControls">
        <label for="position">Y height</label>
        <input
          name="position"
          type="range"
          v-model="store.chartHeight"
          min="25"
          max="75"
          step="1"
        />
        <button @click="resetZoom()">Reset zoom</button>
      </div>
      <div class="color-pickers">
        <div>
          Actos
          <div v-for="(el, index) in options.plugins.annotation.annotations">
            <input
              type="color"
              :id="index"
              name="head"
              v-model="colorsHard[index]"
              @input="setLineChartData()"
            />
            {{ el.title }}
          </div>
        </div>
        <div>
          Tramas
          <div v-for="(el, index) in data.datasets">
            <input
              type="color"
              :id="index"
              name="head"
              v-model="plotColorsHard[index]"
              @input="setLineChartData()"
            />
            {{ el.label }}
          </div>
        </div>
      </div>
    </article>
    <div class="chartWrapper" :style="{ height: store.chartHeight + 'vh' }">
      <Line
        class="plotChart"
        :data="data"
        :options="options"
        ref="lineChart"
        @click="handleClick"
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

const colorsHard = ref([
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
      },
    },
  },

  plugins: {
    legend: {
      display: true,
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
const customSettings = reactive({
  height: 50,
  width: 1450,
});

const labelsSettings = reactive({
  top: 120,
  left: -20,
  rotation: 45,
  fontSize: 12,
  showLabels: true,
  width: 100,
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
  // drawChart();

  setLineChartData();
});

const resetZoom = () => {
  lineChart.value.chart.resetZoom();
};
const handleClick = (event, chart) => {
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
};
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

    let color = colorsHard.value[actIndex];
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
      console.log("EP", maxPlotNumber);
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
      let color = plotColorsHard.value[i - 1];
      console.log("PLOTS COUNT", i);

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
      localData.value = { ...newStory }; // Copiar los datos del store a localData

      setLineChartData(); // Actualiza el gráfico
    }
  },
  { deep: true },
  { immediate: true } // Necesario para observar objetos anidados como escenas
);

</script>

<style>
.chartControls {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}
.color-pickers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.5rem;
}
.chartWrapper {
  height: 2000px;
}
.grid {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr; /* 3 filas de igual altura */
  height: auto; /* Ajustar la altura de la cuadrícula */
}

.grid-item {
  background-color: rgba(150, 150, 150, 0.2);
  padding: 20px;
  text-align: center;
  font-size: 20px;
  border-top: 1px rgba(150, 150, 150, 0.2) solid;
}

#textDisplay {
  border: 1px rgb(255, 0, 0) solid;
  height: 100px;
}
.styleControls {
  padding: 1rem;
  border: 1px black solid;
  display: flex;
}

.hide {
  display: none;
}

.styleControls input {
  border: 1px black solid !important;
}
.sceneContainer {
  border-left: 1px black dotted;
  display: flex;
  text-overflow: ellipsis;
}

.sceneContainer:hover {
  background-color: rgba(167, 166, 166, 0.486);
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
  display: flex; /* Hacer que los segmentos se alineen en una fila */
  height: 300px; /* Altura fija para el gráfico y los segmentos */
  overflow-x: auto; /* Permitir el desplazamiento horizontal */
  position: relative;
}
.line {
  border-top: 1px black solid;
}

.segment {
  min-width: 150px; /* Establece un ancho mínimo para cada segmento, ajustable */
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px; /* Espacio entre segmentos */
  background-color: black;
  position: relative;
}
#dynamicSegments {
  display: flex;
  width: max-content; /* Ajusta el ancho según el contenido */
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
