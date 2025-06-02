// @ts-nocheck
import { ref } from 'vue';
import { useSettingsStore } from "../stores/settings";

const hoveredCharacter = ref(null);

const whiteColor = 'rgba(255,255,255,0.5)'

export function useLineChart(data, options, key, lineChart) {
  const store = useSettingsStore();
  const selectionTooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    type: null, // 'character' | 'plot'
    data: null
  });
  const sceneTooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    type: 'scene',
    expand: false,// 'character' | 'plot'
    data: null
  });
  const hoveredSegmentTooltip = ref({
    visible: false,
    x: 0,
    y: 0,
    data: null
  });
  function clampXToViewport(x, tooltipWidth = 200, margin = 16) {
    const maxX = window.innerWidth - tooltipWidth - margin;
    return Math.min(x, maxX);
  }

  function showSelectionTooltip(x, y, type, data) {
    const chart = lineChart.value?.chart;
    if (!chart) return;
    const rect = chart.canvas.getBoundingClientRect();

    const adjustedX = clampXToViewport(x + rect.left);

    /*     selectionTooltip.value = {
          visible: true,
          x: adjustedX,
          y: y + rect.top,
          type,
          data
        }; */
  }

  const hideTooltips = () => {
    // console.log('Hiding tooltips');
    selectionTooltip.value.visible = false;
    sceneTooltip.value.visible = false;
    hoveredSegmentTooltip.value.visible = false;
  }
  const updateChart = () => {
    //   console.log('Updating chart', lineChart.value?.chart);

    const chartInstance = lineChart.value?.chart;
    store.consoleCustom('6 updateChart', chartInstance)
    if (chartInstance && typeof chartInstance.update === 'function') {
      chartInstance.update();
    } else {
      /* key.value++ */
    }
  };
  const setLineChartData = () => {
    store.consoleCustom('5 setLineChartData', lineChart.value?.chart);

    if (!store.story?.acts) return;

    const scenes = [];
    const { segments, labels } = createSegments(scenes); // ← AHORA retornas dos cosas
    const plotData = buildPlotData();
    const datasets = buildDatasets(plotData);
    const labelsX = createLabels(scenes);
    const characterAnnotations = buildCharacterAnnotations(store.selectedCharacter);
    const actLabelAnnotations = buildActLabelAnnotations(); // puedes optar por eliminar este si te quedas con los de createSegments
    const highlightSceneAnnotation = createHighlightAnnotation();

    data.value.datasets = datasets;
    data.value.labels = labelsX;
    const annotations = options.value.plugins.annotation.annotations;

    const segmentEntries = Object.fromEntries(segments.map(s => [s.id, s]));
    debugger
    const labelEntries = Object.fromEntries(labels.map(l => [l.id, l]));


    options.value.plugins.annotation.annotations = {
      ...segmentEntries,
      ...characterAnnotations,
      ...labelEntries,
      highlightScene: highlightSceneAnnotation
    };

    configureAxisStyles();
    configureEvents(characterAnnotations);
    updateChart();

    store.consoleCustom('5-after setLineChartData', lineChart.value?.chart);

  };

  const updateHighlightOnly = (sceneIndex) => {
    store.isToolTipHidden = true;
    const annotations = options.value.plugins.annotation.annotations;
    const scenes = [];

    const { segments, labels } = createSegments(scenes); // ← AHORA retornas dos cosas

    const characterAnnotations = buildCharacterAnnotations(store.selectedCharacter);
    const segmentEntries = Object.fromEntries(segments.map(s => [s.id, s]));
    const labelEntries = Object.fromEntries(labels.map(l => [l.id, l]));



    const current = options.value.plugins.annotation.annotations;
    options.value.plugins.annotation.annotations = {
      ...current,
      ...characterAnnotations,
      highlightScene: createHighlightAnnotation(sceneIndex),

    };

    /*     options.value.plugins.annotation.annotations = {
          ...characterAnnotations,
          ...labelEntries,
          highlightScene: createHighlightAnnotation(sceneIndex),
        }; */

    updateChart();
  };

  function buildCharacterAnnotations(highlightedTitle) {
    const annotations = {};
    store.consoleCustom('5-4 buildCharacterAnnotations', highlightedTitle);
    let currentSceneIndex = 0;

    store.story.acts.forEach(act =>
      act.scenes.forEach(scene => {
        (scene.characters || []).forEach((charName, i) => {
          const char = store.story.characters.find(c => c.title === charName);
          if (!char) return;
          annotations[`char_${currentSceneIndex}_${i}`] = {
            type: 'point',
            xValue: currentSceneIndex,
            yValue: 1 + i * 0.6,
            radius: highlightedTitle === char.title ? 8 : 5,
            backgroundColor: highlightedTitle === char.title ? lightenHexColor(char.color) : char.color,
            label: highlightedTitle === char.title
              ? {
                enabled: true,
                content: char.title,
                backgroundColor: char.color,
                color: '#fff',
                position: 'start'
              }
              : undefined,
          };
        });
        currentSceneIndex++;
      })
    );

    return annotations;
  }

  function updateSceneLabels() {
    const scenes = [];
    createSegments(scenes); // ← llena `scenes`
    const labelsX = createLabels(scenes)

    lineChart.value.chart.data.labels = labelsX
    updateChart();
  }

function updateActLabelAnnotations() {
  const annotations = options.value.plugins.annotation.annotations;

  if (!annotations) return;

  // Generar las nuevas etiquetas de actos
  const scenes = [];
  const { labels } = createSegments(scenes); // Extraemos solo las labels
  const labelEntries = Object.fromEntries(labels.map(l => [l.id, l]));

  // 1. Eliminar solo las anotaciones antiguas `label_act_*`
/*   for (const key in annotations) {
    if (key.startsWith('label_act_')) {
      delete annotations[key];
    }
  } */

  // 2. Añadir o actualizar las nuevas anotaciones `label_act_*`
  for (const [id, label] of Object.entries(labelEntries)) {
    annotations[id] = label;
  }

  updateChart();
}

  function buildActLabelAnnotations() {
    store.consoleCustom('5-5 buildActLabelAnnotations');
    const annotations = {};
    let index = 0;

    store.story.acts.forEach((act, i) => {
      const actLength = act.scenes.length;
      const centerX = index + actLength / 2;

      annotations[`label_act_${i}`] = {
        type: 'label',
        xValue: centerX,
        yValue: 0.2,
        content: [act.title],
        backgroundColor: act.color + 'CC',
        color: '#fff',
        font: {
          size: 14,
          weight: 'bold',
        },
        position: {
          x: 'center',
          y: 'top',
        },
        padding: 6
      };

      index += actLength;
    });


    return annotations;
  }

  const updatePlotColor = (index, newColor) => {
    const chart = lineChart.value?.chart;
    if (!chart?.data?.datasets) return;

    chart.data.datasets.forEach((ds, i) => {
      const base = store.plotColorsHard[i] || "#999999";
      const selected = i === index;
      ds.borderColor = selected ? newColor : base + "99";
      ds.backgroundColor = selected ? newColor + "80" : base + "30";
      ds.borderWidth = selected ? 4 : 2;
    });

    //   updateChart();
  };

  const resetPlotColors = () => {
    const chart = lineChart.value?.chart;
    if (!chart?.data?.datasets) return;

    chart.data.datasets.forEach((ds, i) => {
      const base = store.plotColorsHard[i] || "#999999";
      ds.borderColor = base + "99";
      ds.backgroundColor = base + "30";
      ds.borderWidth = 2;
    });

    //   updateChart();
  };

  function configureEvents(characterAnnotations) {

    options.value.onClick = (event, elements, chart) => {
      if (handleCharacterClick(event, chart, characterAnnotations)) return;
      if (handlePlotClick(event, elements, chart)) return;

      handleEmptyClick(event, chart);
    };

    options.value.onHover = (event, elements, chart) => {
      const x = event.x;
      const y = event.y;
      const xScale = chart.scales.x;
      const sceneIndex = Math.round(xScale.getValueForPixel(x));
      handleSegmentHover(event, chart);

      // Mostrar la línea de escena actual
      updateHighlightOnly(sceneIndex);
      store.carouselSceneIndex = sceneIndex;
      // Cambiar cursor si estamos sobre punto o línea
      const isOverCharacterPoint = Object.entries(chart.options.plugins.annotation.annotations || {})
        .some(([key, ann]) => {
          if (ann.type !== 'point') return false;
          const px = chart.scales.x.getPixelForValue(ann.xValue);
          const py = chart.scales.y.getPixelForValue(ann.yValue);
          const dist = Math.hypot(x - px, y - py);
          return dist <= (ann.radius || 5) + 5;
        });

      const isOverPlot = elements.length > 0;

      chart.canvas.style.cursor = (isOverCharacterPoint || isOverPlot) ? 'pointer' : 'default';

      // Tooltip de escena
      const scenes = store.story.acts.flatMap(act => act.scenes);
      const scene = scenes[sceneIndex];

      if (scene) {
        const rect = chart.canvas.getBoundingClientRect();
        sceneTooltip.value = {
          visible: true,
          x: clampXToViewport(x + rect.left),
          y: y + rect.top + 50,
          type: 'scene',
          expand: false,
          data: {
            index: sceneIndex + 1,
            title: scene.title,
            desc: scene.description,
            characters: scene.characters || [],
            plots: scene.plots || []
          }
        };
      } else {
        sceneTooltip.value.visible = false;
      }

    };



  }

  function handleCharacterClick(event, chart, characterAnnotations) {
    const { x, y } = event;
    const xScale = chart.scales.x;
    const yScale = chart.scales.y;

    for (const [key, ann] of Object.entries(characterAnnotations)) {
      const [_, sceneIndexStr, charIndexStr] = key.split('_');
      const px = xScale.getPixelForValue(ann.xValue);
      const py = yScale.getPixelForValue(ann.yValue);
      const dist = Math.hypot(x - px, y - py);

      if (dist <= (ann.radius || 5) + 5) {
        const scene = store.story.acts.flatMap(a => a.scenes)[+sceneIndexStr];
        const name = scene?.characters?.[+charIndexStr];
        const selected = store.selectedCharacter === name;

        store.selectedCharacter = selected ? null : name;
        document.body.style.cursor = 'pointer';

        selectionTooltip.value = selected
          ? { visible: false }
          : {
            visible: true,
            x: px + chart.canvas.getBoundingClientRect().left,
            y: py + chart.canvas.getBoundingClientRect().top,
            data: name,
            type: 'character'
          };

        updateHighlightOnly(+sceneIndexStr);
        return true;
      }
    }

    return false;
  }
  function handlePlotClick(event, elements, chart) {
    if (!elements.length) return false;

    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    const datasetIndex = elements[0].datasetIndex;
    const index = elements[0].index;

    if (store.selectedPlotIndex === datasetIndex) {
      store.deselectPlot?.();
      selectionTooltip.value.visible = false;
      resetPlotColors();
    } else {
      store.selectPlot(datasetIndex);
      updatePlotColor(datasetIndex, lightenHexColor(store.plotColorsHard[datasetIndex], 60));

      const px = xScale.getPixelForValue(index);
      const py = yScale.getPixelForValue(chart.data.datasets[datasetIndex].data[index]);
      const rect = chart.canvas.getBoundingClientRect();

      selectionTooltip.value = {
        visible: true,
        x: px + rect.left,
        y: py + rect.top,
        data: store.story.plots[datasetIndex] || 'Trama',
        type: 'plot'
      };
      sceneTooltip.value.visible = false;
    }

    return true;
  }
  function handleEmptyClick(event, chart) {

    const x = event.x;
    const xScale = chart.scales.x;

    store.deselectCharacter?.();
    store.deselectPlot?.();
    sceneTooltip.value.expand = true;
    selectionTooltip.value.visible = false;
    resetPlotColors();

    const sceneIndex = Math.round(xScale.getValueForPixel(x));
    store.goToCarouselVisualizationDirectly(sceneIndex, true);
    store.selectScene(sceneIndex);
    updateHighlightOnly(sceneIndex);
  }

  let segmentHoverTimer = null;

function handleSegmentHover(event, chart) {
  const x = event.x;
  const xScale = chart.scales.x;
  const sceneIndex = Math.round(xScale.getValueForPixel(x));

  let accumulated = 0;
  let hoveredIndex = null;

  for (let i = 0; i < store.story.acts.length; i++) {
    const act = store.story.acts[i];
    const start = accumulated;
    const end = accumulated + act.scenes.length;

    if (sceneIndex >= start && sceneIndex < end) {
      hoveredIndex = i;
      break;
    }
    accumulated = end;
  }

  if( hoveredIndex === null) {
    alert()
  }

  store.selectedSegmentIndex = hoveredIndex;

  const annotations = options.value.plugins.annotation.annotations;

  let index = 0;
  for (let i = 0; i < store.story.acts.length; i++) {
    const act = store.story.acts[i];
    const len = act.scenes.length;
    const id = `segment_${i}`;

    const isActive = i === hoveredIndex || i === store.selectedSegmentIndex;
    const bgColor = isActive ? act.color + '98' : act.color + '40';

    if (!annotations[id]) {
      annotations[id] = {
        type: 'box',
        drawTime: 'beforeDatasetsDraw',
        title: act.title
      };
    }

    // Solo actualizamos las props necesarias
    annotations[id].xMin = index;
    annotations[id].xMax = index + len;
    annotations[id].backgroundColor = bgColor;

    index += len;
  }

  updateChart();
}


  const lightenHexColor = (hex, amount = 80) => {
    hex = hex.replace(/^#/, '');
    const r = Math.min(255, parseInt(hex.slice(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.slice(2, 4), 16) + amount);
    const b = Math.min(255, parseInt(hex.slice(4, 6), 16) + amount);
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
  };

  function createSegments(scenes) {
    const segments = [];
    store.consoleCustom('5-1 createSegments// change in acts',)
    const labels = [];
    let index = 0;

    store.story.acts.forEach((act, i) => {
      const len = act.scenes.length;
      const isSelected = store.selectedSegmentIndex === i;

      segments.push({
        id: `segment_${i}`,
        xMin: index,
        xMax: index + len,
        backgroundColor: isSelected ? act.color + "98" : act.color + "40",
        title: act.title,
        type: "box",
        drawTime: 'beforeDatasetsDraw'
      });

      labels.push({
        id: `label_act_${i}`,
        type: 'label',
        xValue: index + len / 2,
        yValue: 0.5,
        color: 'white',
        backgroundColor: act.color + 'E0',
        content: [`${act.title}`],
        font: { size: 12 },
        textAlign: 'center',
        xAdjust: 0,
        yAdjust: 10,
        drawTime: 'afterDatasetsDraw',
        z: 1000,
      });

      act.scenes.forEach(scene => {
        scenes.push({ title: scene.title, act: act.title });
        index++;
      });
    });

    return { segments, labels };
  }



  function buildPlotData() {
    const data = {};
    let index = 0;

    store.story.acts.forEach(act =>
      act.scenes.forEach(scene => {
        (scene.plots || []).forEach(plot => {
          if (!data[plot]) data[plot] = [];
          data[plot].push(scene.intensity);
        });

        for (let i = 1; i <= store.story.plots.length; i++) {
          if (!scene.plots?.includes(i)) {
            if (!data[i]) data[i] = [];
            data[i].push(null);
          }
        }
        index++;
      })
    );

    return data;
  }

  function buildDatasets(plotData) {
    store.consoleCustom('5-2 buildDatasets');
    console.log("Plot data:", plotData);
    return store.story.plots.map((plot, i) => {
      const base = store.plotColorsHard[i] || "#999999";
      const selected = store.selectedPlotIndex === i;
      return {
        label: plot.title.slice(0, 10) + '...',
        data: plotData[i + 1] || [],
        backgroundColor: selected ? 'red' : base + "30",
        borderColor: selected ? base : base + "99",
        borderWidth: selected ? 3 : 2,
        fill: false,
        tension: 0.4,
        spanGaps: true,
      };
    });
  }

  function createLabels(scenes) {
    store.consoleCustom('5-3 createLabels', lineChart.value?.chart);
    console.log("Creating labels for scenes:", lineChart.value?.chart.data.labels[0],);

    console.log(lineChart.value?.chart, "2- lineChart.value?.chart")


    const truncate = str => str.length > 20 ? str.slice(0, 20) + '...' : str;
    // updateChart();
    return scenes.map((scene, i) => `${i + 1} - ${truncate(scene.title)}`);
  }

  function createCharacterAnnotations() {
    const annotations = {};
    let index = 0;

    store.story.acts.forEach(act =>
      act.scenes.forEach(scene => {
        (scene.characters || []).forEach((name, i) => {
          const char = store.story.characters.find(c => c.title === name);
          if (!char) return;
          annotations[`char_${index}_${i}`] = {
            type: 'point',
            xValue: index,
            yValue: 1 + i * 0.5,
            radius: 5,
            backgroundColor: char.color,
            borderColor: '#ffffff',
            borderWidth: 1,
          };
        });
        index++;
      })
    );

    return annotations;
  }

  function createHighlightAnnotation(index = store.carouselSceneIndex ?? 0) {
    store.consoleCustom('5-6 createHighlightAnnotation', index, lineChart.value?.chart);
    return {
      type: 'line',
      scaleID: 'x',
      value: index,
      borderColor: whiteColor,
      borderWidth: 2,
      borderDash: [6, 6],
      label: {
        content: `Escena ${index + 1}`,
        enabled: true,
        backgroundColor: '#e74c3c',
        color: 'white',
        position: 'start',
      }
    };
  }

  function configureAxisStyles() {
    options.value.scales.y.ticks = {
      color: store.darkMode ? whiteColor : '#333',
      font: { size: store.chartFontSize }
    };
    options.value.scales.x.ticks = {
      font: { size: store.chartFontSize },
      color: (ctx) => {
        const index = ctx.index;
        const sceneIndex = store.carouselSceneIndex;
        const acts = store.story.acts;

        // Color para escena destacada
        if (index === sceneIndex) return '#ffffff';

        let sceneCounter = 0;

        for (let i = 0; i < acts.length; i++) {
          const act = acts[i];
          const start = sceneCounter;
          const end = sceneCounter + act.scenes.length;

          if (index >= start && index < end) {
            if (
              store.selectedSegmentIndex === i ||
              store._hoveredSegmentIndex === i
            ) {
              return '#aaaaaa'; // color más claro para acto hovered o seleccionado
            }
            break;
          }

          sceneCounter = end;
        }

        return '#666666'; // color por defecto
      }
    };

    const gridColor = store.darkMode ? whiteColor : 'rgba(0,0,0,0.1)';
    options.value.scales.x.grid = { color: gridColor };
    options.value.scales.y.grid = { color: gridColor };
  }

  return {
    setLineChartData,
    updateHighlightOnly,
    selectionTooltip,
    sceneTooltip,
    hoveredSegmentTooltip,
    updateChart,
    hideTooltips,
    createSegments,
    createLabels,
    updateActLabelAnnotations,
    updateSceneLabels
  };
}
