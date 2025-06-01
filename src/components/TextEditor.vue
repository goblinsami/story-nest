<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { ref, watch, onMounted, computed } from "vue";
import PlotCreator from "./PlotCreator.vue";
import Act from "./Act.vue";
import CharacterCreator from "./CharacterCreator.vue";
import FilterScenes from "./FilterScenes.vue";
const draggable = VueDraggableNext;
import { useLineChart } from "../composables/useLineChart";
import EditorSettings from "./EditorSettings.vue";
import { positionsConstants } from "../constants/positions";
const positions = computed(() => {
    return positionsConstants();
});
const { hideTooltips } = useLineChart(null, null, null, null);


const props = defineProps({
  mode: {
    required: false,
    default: 'text-editor'
  },
});
const store = useSettingsStore();
const { story } = store;
const showEditorSettings = ref(false);
const isCarousel = computed(() => props.mode === "carousel");

const dragging = ref(false);
const localData = ref({});
const showPlotEditor = ref(false);
const showCharacterEditor = ref(false);
const expandAllActs = ref(true);




const toggleShowEditorSettings = () => {
  /* showEditorSettings.value = !showEditorSettings.value; */
  store.editorSettings.showSettings = !store.editorSettings.showSettings;
};

const createScene = (position, act) => {
  store.addScene(position, act, newScene.value);
  newScene.value.title = "Añade nueva escena";
  newScene.value.description = "Nueva escena";
};
const createAct = (act) => {
  store.addAct();
};

// Función que se ejecuta al empezar a arrastrar
const onStart = () => {
  dragging.value = true;
};

// Función que se ejecuta cuando termina el arrastre
const onEnd = () => {
  dragging.value = false;
  console.log(localData.value);
  store.loadStory(localData.value);
};

const handleShowPlotEditor = () => {
  showPlotEditor.value = !showPlotEditor.value;
};

const dettachWindow = () => {
  console.log("Dettach window",window.innerHeight, window.innerWidth);
  store.dettachWindow()
};

const handleMouseEnter = () => {
  store.isToolTipHidden = false; // Oculta el tooltip al entrar al componente
};
const handleToggleCollapseActs = () => {

  expandAllActs.value = !expandAllActs.value
  if (expandAllActs.value) {
    store.expandAllActs();
  } else {
    store.contractAllActs();
  }
};
onMounted(() => {
  // Cargar los datos locales al montar el componente
  if (store.storyIsSet) {
    localData.value = store.story;
  }
});
const moveToLeft = () => {
  store.moveToLeft()
};
const moveToRight = () => {
  store.moveToRight()

};

watch(
  () => store.story, // Observa cambios en los actos de la historia
  () => {
    localData.value = store.story;
  },
  { immediate: false },
  { deep: true } // Ejecutar inmediatamente si ya hay datos
);
/*  watch(
  () => localData.value, // Observa cambios en localData
  (newData) => {
    store.loadStory(newData); // Actualiza el store cada vez que hay un cambio
  },
  { deep: true } // Necesitas deep para observar objetos anidados
);   */
const buttonText = computed(() => {
  return expandAllActs.value ? "Collapse" : "Expand";
});

const buttonAdjustText = computed(() => {
  return showEditorSettings.value ? "Hide" : "Show";
});
</script>

<template>
  <div @mouseenter="handleMouseEnter">


    <div class="d-flex justify-between"
      style="width: 100%; position: sticky; top: 0; z-index: 10; flex-direction: column; background-color: var(--color-dark-bg);">
      <!-- <slot name="toolbar"> </slot> -->
      <div class="d-flex justify-between">
        <button @click="store.moveToLeft" >⏮️</button>
        <button @click="store.moveToRight">⏭️</button>
      </div>

      <button @click="dettachWindow()" class="act-btn"> Dettach </button>
      <button @click="toggleShowEditorSettings()" v-if="!isCarousel" class="act-btn">{{ buttonAdjustText }}
        ajustes</button>
      <button @click="handleToggleCollapseActs()" class="act-btn">{{ buttonText }} Acts</button>
    </div>
    <main class="acts-container">

<EditorSettings v-model="localData" :show="store.editorSettings.showSettings" />

      <draggable v-model="localData.acts" @start="onStart" @end="onEnd" group="acts" handle=".drag-handle"
        class="acts-container2">

        <Act v-for="(act, actIndex) in localData.acts" class="card no-select" :act="act" :actIndex="actIndex"></Act>
      </draggable>
    </main>
  </div>


</template>
<style>
.toolbar {
  background-color: var(--color-dark-bg);
  opacity: 0.8;
  position: sticky;
}

.acts-container {
  /*  background-color: var(--color-dark-bg); */
}

.acts-container2 {
  position: relative;
  width: inherit;
  padding: 0 0.5rem
}

.act-btn {
  height: 24px;
  padding: 0 8px;
}

.title {
  font-size: 36px;
  font-weight: bold;
  width: 100%;

}

.sub-title {
  font-size: 1.5em;
}

.description {
  font-size: 1rem;
}

.title-block {}

.plot-block {}

.acts {
  height: 100%;
}

.addAct {
  width: 100px;
  margin: 0.5rem 0;
}

.settings-container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  background-color: var(--color-dark-bg);

}

.title-container {
  display: flex;
  justify-content: start;
  flex-direction: column;
  text-align: start;
  width: 20%;
  margin: 0 auto;
}

.hand-closed {
  cursor: grabbing;
  /* Cambia el cursor a una mano cerrada */
}

.acts-container {
  z-index: 99999999999999999999999999999999000;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  /* overflow-y: scroll; */
  padding-bottom: 20rem;
  height: 100vh;
  width: 100%;
  /*     display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 100%; */
}

.grabbing {
  cursor: grabbing;
}

.title-container button {
  height: 24px;
  padding: 1rem 8px;
  margin: 1rem 0;
}
</style>
