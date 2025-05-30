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
  
    selectionTooltip.value = {
      visible: true,
      x: adjustedX,
      y: y + rect.top,
      type,
      data
    };
  }
  

  const updateChart = () => {
    // console.log("Updating chart");
    const chartInstance = lineChart.value?.chart;
    if (chartInstance && typeof chartInstance.update === 'function') {
      chartInstance.update();
    }
  };
  const setLineChartData = () => {
    console.log("Setting line chart data");
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
  };
  
  const updateHighlightOnly = (sceneIndex) => {
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
  function buildActLabelAnnotations() {
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

    updateChart();
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

    updateChart();
  };

  function configureEvents(characterAnnotations) {
    options.value.onClick = (event, elements, chart) => {
      if (handleCharacterClick(event, chart, characterAnnotations)) return;
      if (handlePlotClick(event, elements, chart)) return;

      handleEmptyClick(event, chart);
    };

    options.value.onHover = (event, _, chart) => {
      const x = event.x;
      const y = event.y;
      const xScale = chart.scales.x;
      const sceneIndex = Math.round(xScale.getValueForPixel(x));

      handleSegmentHover(event, chart);

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

      store.goToCarouselVisualizationDirectly(sceneIndex, false);
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
    const y = event.y;
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

    if (store._hoveredSegmentIndex !== hoveredIndex) {
      store._hoveredSegmentIndex = hoveredIndex;

      // Actualiza colores de los segmentos (como ya haces normalmente)
      const annotations = options.value.plugins.annotation.annotations;
      const updatedSegments = {};
      let index = 0;
      store.story.acts.forEach((act, i) => {
        const len = act.scenes.length;
        updatedSegments[`segment_${i}`] = {
          xMin: index,
          xMax: index + len,
          backgroundColor: i === hoveredIndex || i === store.selectedSegmentIndex
            ? act.color + "98"
            : act.color + "40",
          title: act.title,
          type: "box",
          drawTime: 'beforeDatasetsDraw'
        };
        index += len;
      });

      const filtered = Object.fromEntries(Object.entries(annotations).filter(([k]) => !k.startsWith('segment_')));
      options.value.plugins.annotation.annotations = {
        ...filtered,
        ...updatedSegments
      };

      updateChart();
    }

/*     // Mostrar tooltip después de 1s
    if (hoveredIndex !== null) {
      clearTimeout(segmentHoverTimer);
      segmentHoverTimer = setTimeout(() => {
        const act = store.story.acts[hoveredIndex];
        const xStart = store.story.acts.slice(0, hoveredIndex).reduce((acc, a) => acc + a.scenes.length, 0);

        const px = chart.scales.x.getPixelForValue(xStart);
        const rect = chart.canvas.getBoundingClientRect();

        hoveredSegmentTooltip.value = {
          visible: true,
          x: px + rect.left,
          y: rect.top + 10, // Fijo arriba del gráfico
          data: {
            title: act.title,
            color: act.color,
            sceneCount: act.scenes.length
          }
        };
      }, 1000);

    } else {
      clearTimeout(segmentHoverTimer);
      hoveredSegmentTooltip.value.visible = false;
    } */
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
    const truncate = str => str.length > 20 ? str.slice(0, 20) + '...' : str;
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
    hoveredSegmentTooltip
  };
}
