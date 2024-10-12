<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { ref, watch, computed, onMounted } from "vue";
import SceneCreator from "./SceneCreator.vue";
import PlotCreator from "./PlotCreator.vue";
import TComponent from "./TComponent.vue";

const draggable = VueDraggableNext;

const localData = ref({});
const dragging = ref(false);
const editText = ref(false);

const isCarousel = computed(() => props.mode === "carousel");

//const highlightedText = computed(() => props.mode === "carousel");

onMounted(() => {
  originalText.value = props.scene.title;
});

const store = useSettingsStore();
const { story } = store;

const props = defineProps({
  scene: {
    required: true,
  },
  act: {
    required: false,
  },
  sceneIndex: {
    required: true,
  },
  actIndex: {
    required: false,
  },
  mode: {
    required: false,
    default: "text-editor",
  },
});

const handleAddPlotToScene = (actIndex, sceneIndex, scene) => {
  console.log(isCarousel.value);
  if (!isCarousel.value) {
    store.addPlotToScene(actIndex, sceneIndex);
  } else {
    store.editSceneAndAddPlots(scene);
  }
};
const emit = defineEmits(["editScene"]);

//LOGICA DE COLOREAR NOMBRES DE PERSONAJES
//ARAY DE PERSONAJES
//TODO MOVER A STORE
const characters = ref([
  { name: "Joel", color: "ff0000" },
  { name: "Clementine", color: "#a6ff00" },
  { name: "Nireas", color: "#00e1ff" },
]);

const originalText = ref(props.scene.title);

const localCollapse = ref(false);


const highlightNamesInTitle = computed(() => {
  let text = props.scene.title;

  // Para cada personaje, reemplaza su nombre por un <span> con el color correspondiente
  store.story?.characters?.forEach((character) => {
    const regex = new RegExp(`\\b(${character.title})\\b`, "g");
    text = text.replace(
      regex,
      `<span class="highlighted-name" style="color: ${character.color};">$1</span>`
    );
  });
  let sceneNumber = props.scene.number || "";

  return `${sceneNumber} - ${text}`;
});

const highlightNamesInDescription = computed(() => {
  let text = props.scene.description;

  // Para cada personaje, reemplaza su nombre por un <span> con el color correspondiente
  store.story?.characters?.forEach((character) => {
    const regex = new RegExp(`\\b(${character.title})\\b`, "g");
    text = text.replace(
      regex,
      `<span class="highlighted-name" style="color: ${character.color};">$1</span>`
    );
  });

  return text;
});

const dynamicBackgroundStyle = computed(() => {
  if (isCarousel.value) {
    return {
      backgroundColor: `${store.story.acts[props.scene.actIndex].color}20`, // Color azul con opacidad dinámica
    };
  } else {
    return {
      backgroundColor: `${props.act.color}20`,
    };
  }
});

const toggleEditScene = () => {
  editText.value = !editText.value
}

const isHovered = ref(false);

const toggleCollapseScene = () => {
  console.log('toggleCollapseScene')

}

const onHoverScene = () => {
  isHovered.value = true;
};

const onLeaveScene = () => {
  isHovered.value = false;
};
let handleCollapse = computed(() => {
  let isCarousel = props.mode == 'carousel'
/*   if (localCollapse) {
    return localCollapse
  } */
  if (isCarousel) {
    return props.scene.collapsedCarousel
  } else {
    return props.scene.collapsed
  }
});


//TEXTO FORMATEADO
//const titleText = ref(highlightNames(scene.title))

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
    class="card"
    :class="'sceneClass2'"
    @mouseover="onHoverScene"
    @mouseleave="onLeaveScene"
  >
    <div class="act-tag drag-scene-handle carousel-scene-handle" :style="dynamicBackgroundStyle" @click="store.collapseScene(props.scene), localCollapse = !localCollapse">
      <h3 style="padding-left: 1rem"><p v-html="highlightNamesInTitle"></p></h3>
<!--            {{ handleCollapse }} //local {{ localCollapse }}
           {{ props.scene }} -->
    </div>
      <div class="box-container" :class="handleCollapse ? 'expand' : ''" >
        <div class="debug left-box">
          <button
            class="drag-scene-handle"
            v-if="!isCarousel"
            :class="'hideButton' + (isHovered ? 'show' : '')"
          >
            Drag
          </button>
          <button
            class="carousel-scene-handle"
            v-else
            :class="'hideButton' + (isHovered ? 'show' : '')"
          >
            Drag
          </button>
          <button
            @click="toggleEditScene()"
            :class="'hideButton' + (isHovered ? 'show' : '')"
            :style="scene.plots.length > 0 ? {marginBottom: '6rem'} : {}"
          >
            Edit
          </button>
          <button
            @click="handleAddPlotToScene(props.actIndex, props.sceneIndex, scene)"
            v-if="!scene.plots.length > 0"
            :class="'hideButton' + (isHovered ? 'show' : '')"
          >
            Plot
          </button>
          <div v-if="!handleCollapse" class="plot-editor-container">
            <button
              style="margin-bottom: 0.25rem"
              @click="
                store.deletePlotsfromScene(
                  props.actIndex,
                  props.sceneIndex,
                  scene
                )
              "
              v-if="scene.plots.length > 0"
              :class="'hideButton' + (isHovered ? 'show' : '')"
            >
              x
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
            <td v-if="scene.intensity >= 0 && scene.plots.length > 0">
              <input
                type="number"
                v-model="scene.intensity"
                class="plot-intensity"
                min="0"
                max="11"
                @input="emit('editScene', scene)"
              />
            </td>
          </div>
        </div>
        <div class="text-box" v-if="editText" @dblclick="toggleEditScene()">
          <textarea
            type="text"
            class="description"
            v-model="scene.title"
            @input="emit('editScene', scene), store.checkCharactersInScene()"
             maxlength="40"
          ></textarea>
          <textarea
            type="text"
            maxlength="100"

            class="description"
            v-model="scene.description"
            @input="emit('editScene', scene), store.checkCharactersInScene()"
          ></textarea>
        </div>
        <div v-if="!editText" class="text-box" @dblclick="toggleEditScene()">
          <div class="formatted-text description-container" v-if="!editText">
            <p v-html="highlightNamesInDescription"></p>
          </div>
        </div>
        <div class="debug2 right-box">
          <button
            :class="'hideButton' + (isHovered ? 'show' : '')"
            @click="store.deleteScene(props.actIndex, props.sceneIndex)"
            style="margin-left: 0rem"
          >
            X
          </button>
      <div class="create-snippet"           :class="'hideButton' + (isHovered ? 'show' : '')">
        <button @click="store.insertScene('up', actIndex, props.sceneIndex)">&#8593</button>
        <button @click="store.insertScene('down', actIndex, props.sceneIndex)">&#8595</button>
      </div>
        </div>

       </div>
  </li>
</template>
<style>
.sceneClass2 button {
  height: 24px;
  padding: 0 8px;
}

.collapseCard {
  height: min-content;
      display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin: 0.5rem;
    width: auto;
    min-width: 560px;
}
.plot-editor-container {
  position: absolute;
  bottom: 5px;
  left: 10px;
  background-color: #fcfcfd;
}
.box-container {
 /*  min-height: 250px; */
  height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  pointer-events: auto; /* Asegura que puedan recibir clics */
  transition: height 0.5s ease-in-out, opacity 0.5s ease-in-out;
    overflow: hidden;
  opacity: 0;
}
.box-container.expand {
  height: 200px;
  opacity: 1;

}
.text-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
.sceneClass2 {
/*   min-height: 250px;
 */  max-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0.5rem;
  width: auto;
  min-width: 560px;
}
.right-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}
.left-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

p {
  margin: 0px;
}
.plot-intensity {
  border: 1px black solid !important;
  width: 3rem;
}

.create-snippet {
  display: flex;
  flex-direction: column;
}

.hideButton {
  opacity: 0;
  transition: opacity 0.5s ease; /* Duración de 0.5s, y una transición suave */
}
.show {
  opacity: 1;
}
.sceneContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 500px;
  min-height: 100px;

  max-width: 550px;
  padding: 0 1.5rem;
}

.description-container {
  max-width: 450px;
  max-height: 200px;

  /*  overflow-y: scroll; */
}
li {
  list-style: none;
}
.drag-scene-handle {
}

.border {
  border: 1px black solid;
}

.highlighted-name {
  color: blue;
  font-weight: bold;
}

.formatted-text {
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
