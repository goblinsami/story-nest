<script setup>
import Scene from "./Scene.vue";

import { useSettingsStore } from "../stores/settings";
import { ref, watch, onMounted } from "vue";

const localData = ref({});
const dragging = ref(false);

const store = useSettingsStore();
const { story } = store;


const editScene = (scene) => {
  store.editScene(scene)
}
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


watch(
  () => localData.value, // Observa cambios en localData
  (newData) => {
  },
  { deep: true } // Necesitas deep para observar objetos anidados
);
</script>

<template>
  <div class="carousel-container">
    <Scene
      v-for="(scene, sceneIndex) in localData"
      :scene="scene"
      :sceneIndex="sceneIndex"
      :actIndex="0"
      :mode="'carousel'"
      @editScene="editScene"
    >
    </Scene>
  </div>
</template>
<style>
.carousel-container {
  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  height: 30vh;;

}

</style>
