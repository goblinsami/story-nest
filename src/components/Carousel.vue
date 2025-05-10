<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useSettingsStore } from "../stores/settings";
import Act from "./Act.vue";
import Scene from "./Scene.vue";
import LineChart from "./LineChart.vue";

const store = useSettingsStore();

const props = defineProps({
      initialSceneIndex: {
            type: Number,
            default: 0,
      },
});

const sceneIndex = ref(0)
sceneIndex.value = props.initialSceneIndex;
const acts = computed(() => {
      return store.story.acts;
});

onMounted(() => {
      store.expandAllScenesInAllActs();
});

const goToNextScene = () => {
      if (sceneIndex.value < store.getAllScenes.length - 1) {
            sceneIndex.value++;
      } else {
            sceneIndex.value = 0;
      }
      store.carouselSceneIndex = sceneIndex.value
};
const goToPrevScene = () => {
      if (sceneIndex.value > 0) {
            sceneIndex.value--;
      } else {
            sceneIndex.value = store.getAllScenes.length - 1;
      }
      store.carouselSceneIndex = sceneIndex.value

};
const editScene = (scene) => {
      store.editScene(scene);
};

watch(
      () => store.carouselSceneIndex,
      (newVal, oldVal) => {
            if (store.editSceneMode === false) {
                  sceneIndex.value = newVal;
            }

      }
);
</script>

<template>
      <article class="carousel-container">
            <div class=" heading">
                  <button @click="store.toggleShowCarousel()"> Close</button>
            </div>
            <div class="scenes-container" v-if="store.showCarouselScenes">
                  <Scene @editScene="editScene" :scene="store.getAllScenes[sceneIndex - 1]" mode="single" class="prev"
                        v-if="sceneIndex > 0" />
                  <Scene @editScene="editScene" :scene="store.getAllScenes[sceneIndex]" mode="single" />
                  <Scene @editScene="editScene" :scene="store.getAllScenes[sceneIndex + 1]" mode="single" class="post"
                        v-if="sceneIndex < store.getAllScenes.length - 1" />
            </div>
            <div :style="{ width: `calc(100%)` }">
                  <LineChart />
            </div>
            <div class="d-flex">
                  <button @click="goToPrevScene">⬅️</button>
                  <button @click="goToNextScene">➡️</button>
            </div>
      </article>
</template>
<style>
.prev {
      transform: scale(0.8) translateX(50px);
}

.post {
      transform: scale(0.8) translateX(-50px);
}

.carousel-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100vw;
      opacity: 90%;
}

.scenes-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      gap: 1rem;
      width: 50%;
      height: 100%;
}

.heading {
      display: flex;
      padding: 1rem;
      position: absolute;
      top: 0;
      right: 0;
}
</style>