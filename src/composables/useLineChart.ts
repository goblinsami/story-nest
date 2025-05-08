// @ts-nocheck
import { ref } from 'vue';
import { useSettingsStore } from "../stores/settings";

export function useLineChart(data, options, key, lineChart) {
  const store = useSettingsStore();

  const setLineChartData = () => {
    if (!store.story || !store.story.acts) {
      console.error("Story o acts no están definidos aún.");
      return;
    }

    const scenes = [];
    const segments = createSegmentsAndCollectScenes(scenes);
    const plotData = createPlotData();
    const characterAnnotations = createCharacterAnnotations();
    const datasets = buildDatasets(plotData);
    const labels = createLabels(scenes);
    const highlightSceneAnnotation = createHighlightAnnotation();

    data.value.datasets = datasets;
    data.value.labels = labels;

    options.value.plugins.annotation.annotations = {
      ...Object.fromEntries(segments.map((seg, i) => [`segment_${i}`, seg])),
      ...characterAnnotations,
      highlightScene: highlightSceneAnnotation,
    };

    configureAxisStyles();
    configureEvents(characterAnnotations);

    key.value++;
  };

  // === Funciones auxiliares ===

  function createSegmentsAndCollectScenes(scenes) {
    const segments = [];
    let currentSceneIndex = 0;

    store.story.acts.forEach((act) => {
      const segmentLength = act.scenes.length;
      const color = act.color;

      segments.push({
        xMin: currentSceneIndex,
        xMax: currentSceneIndex + segmentLength,
        backgroundColor: color + "30",
        borderColor: color + "99",
        borderWidth: 1,
        title: act.title,
        type: "box",
      });

      act.scenes.forEach((scene) => {
        scenes.push({ title: scene?.title, act: act?.title });
        currentSceneIndex++;
      });
    });

    return segments;
  }

  function createPlotData() {
    const plotData = {};
    let currentSceneIndex = 0;

    store.story.acts.forEach((act) => {
      act.scenes.forEach((scene) => {
        (scene?.plots || []).forEach((plot) => {
          if (!plotData[plot]) plotData[plot] = [];
          plotData[plot].push(scene.intensity);
        });

        for (let i = 1; i <= store.story.plots.length; i++) {
          if (!scene?.plots.includes(i)) {
            if (!plotData[i]) plotData[i] = [];
            plotData[i].push(null);
          }
        }

        currentSceneIndex++;
      });
    });

    return plotData;
  }

  function createCharacterAnnotations() {
    const annotations = {};
    let currentSceneIndex = 0;
    const characters = store.story.characters;

    store.story.acts.forEach((act) => {
      act.scenes.forEach((scene) => {
        (scene.characters || []).forEach((charName, i) => {
          const char = characters.find((c) => c.title === charName);
          if (!char) return;
          annotations[`char_${currentSceneIndex}_${i}`] = {
            type: 'point',
            xValue: currentSceneIndex,
            yValue: 1 + i * 0.5,
            radius: 5,
            backgroundColor: char.color || '#000000',
            borderColor: '#ffffff',
            borderWidth: 1,
          };
        });
        currentSceneIndex++;
      });
    });

    return annotations;
  }

  function buildDatasets(plotData) {
    const datasets = [];
    const plots = store.story.plots;

    for (let i = 1; i <= plots.length; i++) {
      const color = store.plotColorsHard[i - 1] || "#999999";
      datasets.push({
        label: plots[i - 1].title.slice(0, 10) + '...',
        data: plotData[i] || [],
        backgroundColor: color + "30",
        borderColor: color + "99",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        spanGaps: true,
      });
    }

    return datasets;
  }

  function createLabels(scenes) {
    const truncate = (str) => str.length > 20 ? str.slice(0, 20) + '...' : str;
    return scenes.map((scene, index) => `${index + 1} - ${truncate(scene.title)}`);
  }

  function createHighlightAnnotation() {
    const index = store.carouselSceneIndex ?? 0;
    return {
      type: 'line',
      scaleID: 'x',
      value: index,
      borderColor: '#e74c3c',
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
        color: store.darkMode ? '#e6e6e6' : '#333', // o cualquier color que prefieras
        font: {
          size: store.chartFontSize
        }
      };
    options.value.scales.x.ticks = {
      font: { size: store.chartFontSize },
      color: (ctx) => ctx.index === store.carouselSceneIndex ? 'red' : '#e6e6e6',
    };
    options.value.scales.x.grid = {
      color: store.darkMode ? '#e6e6e6' : 'rgba(0, 0, 0, 0.1)',
    };
    options.value.scales.y.grid = {
      color: store.darkMode ? '#e6e6e6' : 'rgba(0, 0, 0, 0.1)',
    };
  }

  function configureEvents(characterAnnotations) {
    options.value.onClick = (event, elements, chart) => {
      const xClick = event.x;
      const yClick = event.y;
      const xScale = chart.scales.x;
      const yScale = chart.scales.y;

      for (const [key, ann] of Object.entries(characterAnnotations)) {
        const px = xScale.getPixelForValue(ann.xValue);
        const py = yScale.getPixelForValue(ann.yValue);
        const dx = xClick - px;
        const dy = yClick - py;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const margin = 5;

        if (distance <= (ann.radius || 5) + margin) {
          const [_, sceneIndexStr, charIndexStr] = key.split('_');
          const sceneIndex = parseInt(sceneIndexStr);
          const charIndex = parseInt(charIndexStr);
          const scene = store.story.acts.flatMap(a => a.scenes)[sceneIndex];
          const characterName = scene?.characters?.[charIndex];
          console.log("👉 Clic en personaje:", characterName, `(escena ${sceneIndex + 1})`);
          return;
        }
      }

      const sceneIndex = Math.round(xScale.getValueForPixel(xClick));
      store.goToCarouselVisualizationDirectly(sceneIndex, true);
    };

    options.value.onHover = (event, elements, chart) => {
      const xClick = event.x;
      const index = Math.round(chart.scales.x.getValueForPixel(xClick));
      store.goToCarouselVisualizationDirectly(index, false);
    };
  }

  const updateHighlightOnly = (sceneIndex) => {
    const annotations = options.value.plugins.annotation.annotations;

    // === 1. Recalcular puntos de personajes ===
    const characterAnnotations = {};
    let currentSceneIndex = 0;

    store.story.acts.forEach((act) => {
      act.scenes.forEach((scene) => {
        (scene.characters || []).forEach((charName, i) => {
          const char = store.story.characters.find(c => c.title === charName);
          if (!char) return;

          const annotationId = `char_${currentSceneIndex}_${i}`;
          characterAnnotations[annotationId] = {
            type: 'point',
            xValue: currentSceneIndex,
            yValue: 1 + i * 0.5,
            radius: 5,
            backgroundColor: char.color || '#000',
            borderColor: '#fff',
            borderWidth: 1,
          };
        });
        currentSceneIndex++;
      });
    });

    // === 2. Extraer anotaciones de tipo segmento ===
    const segmentAnnotations = Object.entries(annotations)
      .filter(([key]) => key.startsWith("segment_"))
      .reduce((acc, [key, val]) => {
        acc[key] = val;
        return acc;
      }, {});

    // === 3. Anotación de escena destacada ===
    const highlightSceneAnnotation = {
      highlightScene: {
        type: 'line',
        scaleID: 'x',
        value: sceneIndex,
        borderColor: '#e74c3c',
        borderWidth: 2,
        borderDash: [6, 6],
        label: {
          content: `Escena ${sceneIndex + 1}`,
          enabled: true,
          backgroundColor: '#e74c3c',
          color: 'white',
          position: 'start',
        }
      }
    };

    // === 4. Asignar las anotaciones ===
    options.value.plugins.annotation.annotations = {
      ...characterAnnotations,
      ...segmentAnnotations,
      ...highlightSceneAnnotation,
    };

    // === 5. Forzar renderizado del gráfico ===
    lineChart.value?.chart.update();
  };

  

  return {
    setLineChartData,
    updateHighlightOnly
  };
}
