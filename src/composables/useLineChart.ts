// @ts-nocheck
import { ref } from 'vue';
import { useSettingsStore } from "../stores/settings";

const hoveredCharacter = ref(null);

const whiteColor = 'rgba(255,255,255,0.5)'

export function useLineChart(data, options, key, lineChart) {
  const store = useSettingsStore();
  const updateChart = () => {
    const chartInstance = lineChart.value?.chart;
    if (chartInstance && typeof chartInstance.update === 'function') {
      chartInstance.update();
    }
  };
  const setLineChartData = () => {
    if (!store.story?.acts) return;

    const scenes = [];
    const segments = createSegments(scenes);
    const plotData = buildPlotData();
    const datasets = buildDatasets(plotData);
    const labels = createLabels(scenes);
    const characterAnnotations = createCharacterAnnotations();
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
    updateChart();
  };

  const updateHighlightOnly = (sceneIndex) => {
    const annotations = options.value.plugins.annotation.annotations;
    const characterAnnotations = {};
    let currentSceneIndex = 0;

    const isHighlighted = (title) => store.selectedCharacter === title;

    store.story.acts.forEach(act =>
      act.scenes.forEach(scene => {
        (scene.characters || []).forEach((charName, i) => {
          const char = store.story.characters.find(c => c.title === charName);
          if (!char) return;
          characterAnnotations[`char_${currentSceneIndex}_${i}`] = {
            type: 'point',
            xValue: currentSceneIndex,
            yValue: 1 + i * 0.6,
            radius: isHighlighted(char.title) ? 8 : 5,
            backgroundColor: isHighlighted(char.title) ? lightenHexColor(char.color) : char.color,
            label: isHighlighted(char.title)
              ? { enabled: true, content: char.title, backgroundColor: char.color, color: '#fff', position: 'start' }
              : undefined,
          };
        });
        currentSceneIndex++;
      })
    );

    const segmentAnnotations = Object.entries(annotations)
      .filter(([k]) => k.startsWith("segment_"))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    options.value.plugins.annotation.annotations = {
      ...characterAnnotations,
      ...segmentAnnotations,
      highlightScene: createHighlightAnnotation(sceneIndex),
    };

    updateChart();
  };

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
      const x = event.x, y = event.y;
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
          store.selectedCharacter = store.selectedCharacter === name ? null : name;
          updateHighlightOnly(+sceneIndexStr);
          return;
        }
      }

      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        if (store.selectedPlotIndex === datasetIndex) {
          store.deselectPlot?.();
          resetPlotColors();
        } else {
          store.selectPlot(datasetIndex);
          updatePlotColor(datasetIndex, lightenHexColor(store.plotColorsHard[datasetIndex], 60));
        }
        return;
      }

      store.deselectCharacter?.();
      store.deselectPlot?.();
      resetPlotColors();

      const sceneIndex = Math.round(xScale.getValueForPixel(x));
      store.goToCarouselVisualizationDirectly(sceneIndex, true);
      updateHighlightOnly(sceneIndex);
    };

    options.value.onHover = (event, _, chart) => {
      const x = event.x;
      const index = Math.round(chart.scales.x.getValueForPixel(x));
      store.goToCarouselVisualizationDirectly(index, false);
    };
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
    let index = 0;

    store.story.acts.forEach(act => {
      const len = act.scenes.length;
      segments.push({
        xMin: index,
        xMax: index + len,
        backgroundColor: act.color + "30",
        borderColor: act.color + "99",
        borderWidth: 1,
        title: act.title,
        type: "box",
      });

      act.scenes.forEach(scene => {
        scenes.push({ title: scene.title, act: act.title });
        index++;
      });
    });

    return segments;
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
      color: ctx => ctx.index === store.carouselSceneIndex ? '#fff' : '#ccc',
    };
    const gridColor = store.darkMode ? whiteColor : 'rgba(0,0,0,0.1)';
    options.value.scales.x.grid = { color: gridColor };
    options.value.scales.y.grid = { color: gridColor };
  }

  return {
    setLineChartData,
    updateHighlightOnly,
  };
}
