<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { ref, watch } from "vue";
import SceneCreator from "./SceneCreator.vue";
import PlotCreator from "./PlotCreator.vue";
import Scene from "./Scene.vue";
import CollapseButtons from "./CollapseButtons.vue";

const draggable = VueDraggableNext;

const localData = ref({});
const dragging = ref(false);

const store = useSettingsStore();
const { story } = store;
const onStart = () => {};

// Función que se ejecuta cuando termina el arrastre
const onEnd = () => {};
const props = defineProps({
  act: {
    required: true,
  },
  actIndex: {
    required: true,
  },
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
      <div class="d-flex justify-between">
        <button class="drag-handle">Drag</button>
        <CollapseButtons mode="act" :actIndex="props.actIndex" />

        <button @click="store.deleteAct(props.actIndex)" class="deleteAct">
          X
        </button>
      </div>
      <div class="act-header-container">
        <input
          type="color"
          :id="props.actIndex"
          name="head"
          v-model="props.act.color"
          class="act-color-sample"
        />
        <input type="text" class="title" v-model="props.act.title" />
        <h2>
          <span>{{ act.scenes.length }}</span>
        </h2>
      </div>
    </div>
    <!--       <SceneCreator :act="act" class="card"/> -->
    <draggable
      v-model="act.scenes"
      @start="onStart"
      @end="onEnd"
      group="scenes"
      handle=".drag-scene-handle"
    >
      <Scene
        v-for="(scene, sceneIndex) in act.scenes"
        :scene="scene"
        :sceneIndex="sceneIndex"
        :actIndex="props.actIndex"
        :act="act"
      >
      </Scene>
    </draggable>
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
.act {
  width: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 100%;

  /*       display: flex;
  flex-direction: row;
  overflow-x: scroll;*/
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
