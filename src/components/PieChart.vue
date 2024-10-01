<template>
  <div id="canvas-container">
    <div style="width: 500px">
      <Pie :data="pieData" :options="pieOptions" ref="pieChart" :key="key" />
      {{ pieData }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import jsonStory from "../constants/story.json";
import { Line, Pie } from "vue-chartjs";
import annotationPlugin from "chartjs-plugin-annotation";
import zoomPlugin from "chartjs-plugin-zoom";

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

// Definir el plugin de Chart.js para agregar anotaciones personalizadas
// Definir el plugin de Chart.js para agregar anotaciones personalizadas
const customAnnotationsPlugin = {
  id: "customAnnotationsPlugin",
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales } = chart;

    // Asegúrate de que la escala X esté disponible
    if (!scales.x) {
     // console.warn("La escala X no está disponible.");
      return;
    }

    const scenes = chart.data.labels;

    // Establecer estilo para las anotaciones
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Dibujar las etiquetas para cada escena alineadas al borde de los círculos
    scenes.forEach((scene, index) => {
      const xPosition = scales.x.getPixelForValue(index);
      const yPosition = scales.y.getPixelForValue(
        chart.data.datasets[0].data[index]
      );

      // Calcular el radio del punto (puedes ajustar el valor del radio según tu estilo)
      const radius = 5; // Ajusta este valor si tus puntos son más grandes o más pequeños

      // Colocar la etiqueta ligeramente fuera del círculo
      const labelYPosition = yPosition - radius - 10; // 10px por encima del círculo

      ctx.fillText(scene, xPosition, labelYPosition); // Dibujar la etiqueta
    });

    // ANOTACIÓN DE PRUEBA
    const testXPosition = scales.x.getPixelForValue(3); // X en la posición del índice 3
    const testYPosition = scales.y.getPixelForValue(50); // Un valor arbitrario de Y

    ctx.fillStyle = "red"; // Cambiar color para la anotación de prueba
    ctx.fillText("Anotación de Prueba", testXPosition, testYPosition); // Dibujar anotación
  },
};


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
  ArcElement,
);

// Registrar el plugin personalizado con el nuevo nombre

// Registrar el plugin personalizado con el nuevo nombre

const canvas = ref(null);
const textDisplay = ref(null);
const lineChart = ref(null);
const scenes = ref(null);
const key = ref(0);
const pieData = ref({
  labels: Array.from({ length: 100 }, (_, i) => `Escena ${i + 1}`), // Generar 100 etiquetas
  datasets: [
    {
      backgroundColor: Array.from({ length: 100 }, (_, i) => {
        const colors = ["#FF3784", "#36A2EB", "#4BC0C0", "#F77825", "#9966FF"];
        return colors[Math.floor(i / 25)]; // Cambiar color cada 25 elementos
      }),
      data: Array.from({ length: 100 }, () => 1), // Todos los valores son 1
    },
  ],
});


// Opciones del gráfico con anotaciones
const pieOptions = ref({
  plugins: {
    legend: false,
    customAnnotationsPlugin: {},
  },
    scales: {
    x: {
      type: 'category',
      labels: ['Escena 1', 'Escena 2', 'Escena 3'], // Asegúrate de que las etiquetas sean correctas
    },
    y: {
      beginAtZero: true,
    },
  },

});

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
  // drawChart();

 // setPieChartData();
});

const resetZoom = () => {
  lineChart.value.chart.resetZoom();
};
const handleClick = (event, chart) => {
  const chartInstance = lineChart.value.chart; // Acceder a la instancia del gráfico
  const { x } = event; // Obtiene la posición x del clic

  // Verificar en qué segmento ocurrió el clic
  const annotations = chartInstance.options.plugins.annotation.annotations;

  for (const annotation of Object.values(annotations)) {
    const xMin = chartInstance.scales["x"].getPixelForValue(annotation.xMin);
    const xMax = chartInstance.scales["x"].getPixelForValue(annotation.xMax);

    if (x >= xMin && x <= xMax) {
      // El clic ocurrió dentro de este segmento
    }
  }
};
const setLineChartData = () => {
  // lineChart.value.style.height = '1200px'
  const acts = jsonStory.acts; // Datos de actos y escenas
  const scenes = [];
  const segments = [];
  const plotData = {}; // Objeto para almacenar los datos de cada trama
  let maxPlotNumber = 0; // Para determinar cuántas tramas distintas hay
  let startX = 0;

  // Recorrer los actos y las escenas para construir los segmentos y los datos de las tramas
  acts.forEach((act, actIndex) => {
    const segmentLength = act.scenes.length;

    // Crear los segmentos
    const segment = {
      xMin: startX,
      xMax: startX + segmentLength,
      backgroundColor: `rgba(${actIndex * 50}, 99, 132, 0.2)`,
      borderColor: `rgba(${actIndex * 50}, 99, 132, 1)`,
      borderWidth: 1,
      title: act.title,
      type: "box",
    };
    segments.push(segment);

    // Recorrer las escenas del acto
    act.scenes.forEach((scene) => {
      scenes.push({
        title: scene.title,
        act: act.title,
      });

      // Recorrer las tramas en la escena y actualizar el plotData
      scene.plots.forEach((plot) => {
        maxPlotNumber = Math.max(maxPlotNumber, plot); // Determinar el número máximo de tramas
        if (!plotData[plot]) plotData[plot] = []; // Crear array para la trama si no existe
        plotData[plot].push(scene.intensity); // Añadir intensidad a la trama
      });

      // Para las tramas que no están en la escena, añadir `null`
      for (let i = 1; i <= maxPlotNumber; i++) {
        if (!scene.plots.includes(i)) {
          if (!plotData[i]) plotData[i] = []; // Crear array si aún no existe
          plotData[i].push(null); // Añadir `null` si no está presente en la escena
        }
      }
    });

    // Actualizar el valor inicial para el próximo segmento
    startX += act.scenes.length;
  });

  // Crear datasets dinámicos basados en el número de tramas
  const datasets = [];
  for (let i = 1; i <= maxPlotNumber; i++) {
    datasets.push({
      label: `Trama ${i}`,
      data: plotData[i], // Usar los datos de la trama correspondiente
      borderColor: `rgba(${i * 50}, 99, 132, 1)`, // Color único para cada trama
      backgroundColor: `rgba(${i * 50}, 99, 132, 0.2)`,
      borderWidth: 2,
      fill: false, // No rellenar debajo de la línea
      tension: 0.4,
      spanGaps: true, // Permitir saltar puntos nulos
    });
  }

  // Actualizar los datos del gráfico
  data.value.datasets = datasets;
  data.value.labels = scenes.map((el, index) => `${index + 1} - ${el.title}`);
  options.value.plugins.annotation.annotations = segments;
  key.value++;
};
const setPieChartData = () => {
  const labels = [];
  const data = [];
  const annotations = [];

  const acts = jsonStory.acts; // Datos de actos y escenas
  let totalScenes = 0;

  // Recorre los actos para llenar las etiquetas y los datos
  acts.forEach((act) => {
    labels.push(act.title); // Suponiendo que cada acto tiene un título
    const sceneCount = act.scenes.length;
    data.push(sceneCount); // Contamos las escenas en cada acto

    // Recorre cada escena para crear anotaciones
    act.scenes.forEach((scene) => {
      // Cálculo de la posición angular para la anotación
      const angle =
        (totalScenes / acts.reduce((sum, a) => sum + a.scenes.length, 0)) * 360;

      annotations.push({
        type: "label",
        content: scene.title, // El título de la escena
        position: {
          x: "50%", // Colocar en el borde radial
          y: "50%",
        },
        rotation: angle, // Gira la anotación según el ángulo calculado
        textAlign: "center",
        font: {
          size: 12,
          style: "italic",
        },
        backgroundColor: "transparent", // Sin fondo para las anotaciones
        borderColor: "transparent", // Sin borde para las anotaciones
      });

      totalScenes++;
    });
  });

  pieData.value.labels = labels;

  pieData.value.datasets[0].data = data;
  // pieOptions.value.plugins.annotation.annotations = annotations;


  key.value++;
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
/* const drawChart = () => {
  const segmentsContainer = document.getElementById("dynamicSegments");

  // Limpiar los segmentos antiguos, pero no el gráfico de líneas
  segmentsContainer.innerHTML = "";

  // Agregar los nuevos segmentos
  jsonStory.acts.forEach((act, index) => {
    let segment = document.createElement("div");
    segment.setAttribute("id", index);
    segment.classList.add("segment");
    segment.style.backgroundColor = colors[index % colors.length];

    let actLabelContainer = document.createElement("div");
    let actLabel = document.createElement("div");
    actLabel.style.position = "absolute";
    actLabel.style.padding = "1rem 0.5rem";

    actLabel.textContent = act.title;
    actLabelContainer.appendChild(actLabel);
    segment.appendChild(actLabelContainer);

    act.scenes.forEach((scene) => {
      let sceneContainer = document.createElement("div");
      sceneContainer.classList.add("sceneContainer");

      let sceneElement = document.createElement("span");
      sceneElement.classList.add("scene");

      if (labelsSettings.showLabels) {
        sceneElement.textContent = scene.title;
      }

      sceneElement.style.fontSize = `${labelsSettings.fontSize}px`;
      sceneElement.style.top = `${labelsSettings.top}px`;
      sceneElement.style.left = `${labelsSettings.left}px`;
      sceneElement.style.transform = `rotate(${labelsSettings.rotation}deg)`;

      sceneContainer.appendChild(sceneElement);
      segment.appendChild(sceneContainer);
    });

    segmentsContainer.appendChild(segment);
  });
};
 */
const handleShowLabels = () => {
  labelsSettings.showLabels = !labelsSettings.showLabels;
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
/* .plotChart {

} */
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
