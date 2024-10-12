<script setup>
import Scene from "./Scene.vue";

import { useSettingsStore } from "../stores/settings";
import { ref, watch, onMounted, computed } from "vue";
import { VueDraggableNext } from "vue-draggable-next";
const draggable = VueDraggableNext;

const localData = ref({});
const dragging = ref(false);

const store = useSettingsStore();
const { story } = store;

const editScene = (scene) => {
  store.editScene(scene);
};
onMounted(() => {
  localData.value = store.getAllScenes;
});
watch(
  () => store.story, // Observa cambios en toda la historia
  (newStory) => {
    if (newStory) {
      //      localData.value = { ...newStory }; // Copiar los datos del store a localData
      localData.value = store.getAllScenes;
    }
  },
  { deep: true },
  { immediate: true } // Necesario para observar objetos anidados como escenas
);
const onStart = () => {
};

// Función que se ejecuta cuando termina el arrastre
const onEnd = (evt) => {
  console.log('DEAG IN CAROUSEL END')

  let scene1 = localData.value[evt.newIndex]
  let scene2 = localData.value[evt.oldIndex]

  store.dragScenesInCarousel(scene1, scene2, evt.oldIndex, evt.newIndex)

};
watch(
  () => localData.value, // Observa cambios en localData
  (newData) => {},
  { deep: true } // Necesitas deep para observar objetos anidados
);
</script>

<template>
  <div class="carousel-container">
    <draggable
      v-model="localData"
      @start="onStart"
      @end="onEnd"
      group="scenes"
      handle=".carousel-scene-handle"
      class="d-flex"
    >
      <Scene
        v-for="(scene, sceneIndex) in localData"
        :scene="scene"
        :sceneIndex="sceneIndex"
        :actIndex="0"
        :mode="'carousel'"
        @editScene="editScene"
        :key="sceneIndex"
      >
      </Scene>
    </draggable>
  </div>
</template>
<style>
.carousel-container {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
}
</style>
