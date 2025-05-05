<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { ref, watch, onMounted, computed } from "vue";
import SceneCreator from "./SceneCreator.vue";
import PlotCreator from "./PlotCreator.vue";
import Act from "./Act.vue";
import CharacterCreator from "./CharacterCreator.vue";
import FilterScenes from "./FilterScenes.vue";
const draggable = VueDraggableNext;
onMounted(() => {
  /* if (isCarousel) {
    toggleShowEditorSettings()
  
  }
   */
});
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

const menuVisible = ref(false); // Controla la visibilidad del menú
const menuX = ref(0); // Coordenada X donde aparecerá el menú
const menuY = ref(0); // Coordenada Y donde aparecerá el menú

// Mostrar el menú en la posición del clic derecho
const showMenu = (event) => {
  menuVisible.value = true;
  menuX.value = event.clientX;
  menuY.value = event.clientY;
};

// Ocultar el menú
const hideMenu = () => {
  menuVisible.value = false;
};

// Manejar la opción seleccionada
const handleOption = (option) => {
  console.log("Seleccionaste:", option);
  hideMenu(); // Ocultar el menú después de seleccionar
};

const newScene = ref({
  title: "Añade nueva escena",
  description: "Nueva escena",
});

const toggleShowEditorSettings = () => {
  showEditorSettings.value = !showEditorSettings.value;
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
  store.updateStory(localData.value);
};

const handleShowPlotEditor = () => {
  showPlotEditor.value = !showPlotEditor.value;
};
const handleToggleCollapseActs = () => {

  expandAllActs.value = !expandAllActs.value
  if (expandAllActs.value) {
    store.expandAllActs();
  } else {
    store.contractAllActs();
  }
};
watch(
  () => store.story, // Observa cambios en los actos de la historia
  () => {
    localData.value = store.story;
  },
  { immediate: true },
  { deep: true } // Ejecutar inmediatamente si ya hay datos
);
watch(
  () => localData.value, // Observa cambios en localData
  (newData) => {
    store.updateStory(newData); // Actualiza el store cada vez que hay un cambio
  },
  { deep: true } // Necesitas deep para observar objetos anidados
);
const buttonText = computed(() => {
  return expandAllActs.value ? "Collapse" : "Expand";
});
</script>

<template>
  <main>
    <article>
      <!--       <FilterScenes /> -->
      <div class="title-container">
        <button @click="toggleShowEditorSettings()" v-if="!isCarousel" class="padding: 1rem">Ocultar ajustes</button>
      </div>

      <div class="settings-container" v-if="showEditorSettings && !isCarousel">
        <div class="title-block">
          <div>
            <h1>
              <input type="text" class="title" v-model="localData.title" maxlength="50" />
            </h1>
            <textarea type="textarea" class="sub-title" v-model="localData.description"></textarea>
          </div>

          <div class="d-flex settings">
            <button @click="store.addAct()" class="addAct">
              Añadir acto
            </button>
            <button @click="store.addNumeration()" class="addAct">
              Numerar
            </button>
            <button @click="handleShowPlotEditor(), (showCharacterEditor = false)" class="addAct">
              Tramas
            </button>
            <button @click="
              (showCharacterEditor = !showCharacterEditor),
              (showPlotEditor = false)
              " class="addAct">
              Personajes
            </button>
            <button @click="store.deleteStory()" class="addAct">
              Borrar todo
            </button>
          </div>
          <span v-if="localData.acts">{{ store.getScenesLength }}</span>
        </div>

        <div class="plot-block">
          <PlotCreator v-if="showPlotEditor" />
          <CharacterCreator v-if="showCharacterEditor" />
        </div>
      </div>

      <button @click="handleToggleCollapseActs()" class="act-btn">{{ buttonText }} Acts</button>
      <div class="">
        <draggable v-model="localData.acts" @start="onStart" @end="onEnd" group="acts" handle=".drag-handle">
          <Act v-for="(act, actIndex) in localData.acts" class="card no-select" :act="act" :actIndex="actIndex"></Act>
          {{ act }}
        </draggable>
      </div>
    </article>
  </main>
</template>
<style>
.act-btn {
  height: 24px;
  padding: 0 8px;
}

.title {
  font-size: 36px;
  font-weight: bold;
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
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  padding-bottom: 2rem;
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
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  overflow-y: scroll;
  padding-bottom: 20rem;
  height: 100vh;
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
