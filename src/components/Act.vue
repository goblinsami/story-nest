<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { ref, watch } from "vue";
import SceneCreator from "./SceneCreator.vue";
import PlotCreator from "./PlotCreator.vue";
import Scene from "./Scene.vue";
const draggable = VueDraggableNext;

const localData = ref({});
const dragging = ref(false);

const store = useSettingsStore();
const { story } = store;
const onStart = () => {
};

// Función que se ejecuta cuando termina el arrastre
const onEnd = () => {

};
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
  <ul>
    <div class="d-flex justify-between">
      <div class="drag-handle">Drag</div>

      <button @click="store.deleteAct(props.actIndex)" class="deleteAct">
        X
      </button>
    </div>
    <div class="act-header-container">
      <input
        type="color"
        :id="props.actIndex"
        name="head"
        v-model="store.colorsHard[props.actIndex]"
        class="act-color-sample"
      />

      <input type="text" class="title" v-model="props.act.title" />
      <h2>
        <span>{{ act.scenes.length }}</span>
      </h2>
    </div>
    <div class="act">
      <SceneCreator :act="act" />
      <draggable
        v-model="act.scenes"
        @start="onStart"
        @end="onEnd"
        group="scenes"
        handle=".drag-scene-handle">
        <Scene v-for="(scene, sceneIndex) in act.scenes" :scene="scene" :sceneIndex="sceneIndex" :actIndex="props.actIndex"> </Scene>
<!--         <li
          v-for="(scene, sceneIndex) in act.scenes"
          class="sceneClass card"
          :class="dragging ? 'grabbing' : ''"
            :key="sceneIndex"
        >
          <table>
            <tr>
            <div class="drag-scene-handle">Drag </div>

              <td>
                {{ scene.number }} -
                <textarea
                  type="text"
                  class="description"
                  v-model="scene.title"
                ></textarea>
              </td>
              <td>
                <textarea
                  type="text"
                  class="description"
                  v-model="scene.description"
                ></textarea>
              </td>
              <td>
                <button @click="store.deleteScene(props.actIndex, sceneIndex)">
                  X
                </button>
              </td>
            </tr>
            {{
              scene.plots.length
            }}
            <tr>
              <button
                @click="store.addPlotToScene(props.actIndex, sceneIndex)"
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
                />
              </td>
            </tr>
          </table>
          <div class="create-snippet">
                    <button @click="store.insertScene('up', act, sceneIndex)">&#8593</button>
                    <button @click="store.insertScene('down', act, sceneIndex)">&#8595</button>
          </div>
        </li> -->
      </draggable>
    </div>
  </ul>
</template>
