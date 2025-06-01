<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { computed, ref, watch } from "vue";
import PlotCreator from "./PlotCreator.vue";
import Scene from "./Scene.vue";
import CollapseButtons from "./CollapseButtons.vue";

const draggable = VueDraggableNext;

const localData = ref({});
const dragging = ref(false);
const expandScenes = ref(true);
const expandAct = ref(true);

const store = useSettingsStore();
const { story } = store;
const onStart = () => { };
const localCollapse = ref(false);

// Función que se ejecuta cuando termina el arrastre
const onEnd = () => { };
const props = defineProps({
  act: {
    required: true,
  },
  actIndex: {
    required: true,
  },
});
const handleToggleCollapse = (actIndex) => {

  expandScenes.value = !expandScenes.value;
  if (expandScenes.value) {
    store.expandAllScenes('act', actIndex);
  } else {
    store.collapseAllScenes('act', actIndex);
  }
};
let handleCollapse = computed(() => {

  return props.act.collapsed
});

const collapseAct = () => {
  expandAct.value = !expandAct.value;
};

const buttonText = computed(() => {
  return !expandScenes.value ? "Collapse" : "Expand";
});
const collapseActText = computed(() => {
  return expandAct.value ? "Collapse" : "Expand";
});
watch(
  () => store.story, // Observa cambios en los actos de la historia
  () => {
    localData.value = store.story;
  },
  { immediate: true },
  { deep: true } // Ejecutar inmediatamente si ya hay datos
);
</script>

<template>
  <div class="act">
    <div class="act-info">
      <div class="d-flex justify-between act-tag">
        <button class="drag-handle">Drag</button>
        <button class="drag-handle" @click="store.collapseAct(props.actIndex)">{{ collapseActText }} Act</button>
        <button @click="handleToggleCollapse(actIndex)" :style="{ visibility: act.collapsed ? 'visible' : 'hidden' }">{{ buttonText }} All Scenes</button>

        <button @click="store.deleteAct(props.actIndex)" class="deleteAct">
          X
        </button>
      </div>
      <div class="act-header-container" :style="{ border: `1px solid ${props.act.color}` }">
        <input @change="store.triggerChange()" type="color" :id="props.actIndex" name="head" v-model="props.act.color" class="act-color-sample" />
        <input type="text" class="title" v-model="props.act.title" />
        <h2>
          <span>{{ act.scenes.length }}</span>
        </h2>
      </div>
    </div>
    <div class="act-content" :class="handleCollapse ? 'expand' : ''">
      <draggable v-model="act.scenes" @start="onStart" @end="onEnd" group="scenes" handle=".drag-scene-handle">
        <Scene v-for="(scene, sceneIndex) in act.scenes" :scene="scene" :sceneIndex="sceneIndex"
          :actIndex="props.actIndex" :act="act">
        </Scene>
      </draggable>
    </div>
  </div>
</template>
<style>
.act-info {
  opacity: 0.5;
}

.act-info:hover {
  opacity: 1;
}

ul .card.no-select {
  padding: none;
}

.act button,
.drag,
.deleteAct {
  height: 24px;
  padding: 0 8px;
}

.act-content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
}

.act-content.expand {
  max-height: 3000px;
  /* Elige un número suficientemente alto para que el contenido quepa */
  opacity: 1;
}

/* .deleteAct {
  margin: 0.5rem 0;
} */

.act-header-container {
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
  align-items: center;
}
</style>
