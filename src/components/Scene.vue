<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { ref, watch, computed } from "vue";
import SceneCreator from "./SceneCreator.vue";
import PlotCreator from "./PlotCreator.vue";

const draggable = VueDraggableNext;

const localData = ref({});
const dragging = ref(false);

const isCarousel = computed(() => props.mode === 'carousel');

const store = useSettingsStore();
const { story } = store;

const props = defineProps({
  scene: {
    required: true,
  },
  sceneIndex: {
    required: true,
  },
  actIndex: {
    required: false,
  },
  mode: {
    required: false,
    default: 'text-editor'
  }
});

const handleAddPlotToScene = (actIndex, sceneIndex, scene) => {
  if (!isCarousel) {
    store.addPlotToScene(actIndex, sceneIndex)
  } else {
    emit('editScene', scene)
  }

}
const emit = defineEmits(["editScene"]);

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
        <li
          class="sceneClass card"
        >
        <div class="drag-scene-handle" v-if="!isCarousel">Drag </div>
          <table>
            <tr>
              <td>
                {{ scene.number }} -
                <textarea
                  type="text"
                  class="description"
                  v-model="scene.title"
                  @input="emit('editScene', scene)"

                ></textarea>
              </td>
              <td>
                <textarea
                  type="text"
                  class="description"
                  v-model="scene.description"
                  @input="emit('editScene', scene)"

                ></textarea>
              </td>
              <td>
                <button v-if="!isCarousel" @click="store.deleteScene(props.actIndex, props.sceneIndex)">
                  X
                </button>
              </td>
            </tr>
            <tr>
              <button
                @click="handleAddPlotToScene(props.actIndex, props.sceneIndex, scene)"
                v-if="!scene.plots.length > 0 && localData.plots.length"
              >
                Plot
              </button>
              <td v-if="scene.plots.length > 0">
                <div v-for="(plot, index) in localData.plots">
                  <input
                    type="checkbox"
                    id=""
                    name=""
                    v-model="scene.plots"
                    :value="index + 1"
                    :style="{ accentColor: store.plotColorsHard[index] }"
                    @change="emit('editScene', scene)"

                  />
                  <label for="">{{ plot.title }}</label>
                </div>
              </td>
              <td>
                <input
                  v-if="scene.intensity >= 0 && scene.plots.length > 0"
                  type="number"
                  v-model="scene.intensity"
                  class="plot-intensity"
                  min="0"
                  max="11"
                  @input="emit('editScene', scene)"

                />
              </td>
            </tr>
          </table>
          <div class="create-snippet" v-if="!isCarousel">
            <button @click="store.insertScene('up', actIndex, props.sceneIndex)">&#8593</button>
            <button @click="store.insertScene('down', actIndex, props.sceneIndex)">&#8595</button>
          </div>
          <h3 v-if="isCarousel">Acto {{ scene.actIndex + 1}}</h3>
        </li>
</template>
<style>
li {
  list-style: none;
}</style>
