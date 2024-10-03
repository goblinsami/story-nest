<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { ref, watch } from "vue";
import SceneCreator from "./SceneCreator.vue";
import PlotCreator from "./PlotCreator.vue";


const draggable = VueDraggableNext;

const store = useSettingsStore();
const { story } = store;

const dragging = ref(false);
const localData = ref({});
const showPlotEditor = ref(false);

const menuVisible = ref(false); // Controla la visibilidad del menú
const menuX = ref(0);           // Coordenada X donde aparecerá el menú
const menuY = ref(0);           // Coordenada Y donde aparecerá el menú


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
  console.log('Seleccionaste:', option);
  hideMenu(); // Ocultar el menú después de seleccionar
};

const newScene = ref({
  title: "Añade nueva escena",
  description: "Nueva escena",
});

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
  showPlotEditor.value = !showPlotEditor.value
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
</script>

<template>
  <main>
    <article>

      <div class="title-container">
        <div>
          <h1>
            <input
              type="text"
              class="title"
              v-model="localData.title"
              maxlength="50"
            />
          </h1>
          <textarea
            type="textarea"
            class="sub-title"
            v-model="localData.description"
          ></textarea>
        </div>
        <span style="display: flex;">
          <button @click="store.addAct()" class="addAct">Añadir acto</button>
          <button @click="store.addNumeration()" class="addAct">numerar</button>
          <button @click="handleShowPlotEditor()" class="addAct">plots</button>
          <button @click="store.deleteStory()" class="addAct">eliminar historia</button>
        </span>

        <span v-if="localData.acts">{{ store.getScenesLength }}</span>
        <div v-if="showPlotEditor">
          <PlotCreator/>
        </div>
      </div>


      <div class="">
        <draggable
          v-model="localData.acts"
          @start="onStart"
          @end="onEnd"
          class="acts-container"
          group="acts"
        >
          <ul v-for="(act, actIndex) in localData.acts" class="card">
            <button @click="store.deleteAct(actIndex)" class="deleteAct">
              X
            </button>
            <div class="act-header-container">
              <input type="text" class="title" v-model="act.title" />
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

              >
                <li
                  v-for="(scene, sceneIndex) in act.scenes"
                  class="sceneClass card"
                  :class="dragging ? 'grabbing' : ''"
                >
                  <table>
                    <tr>
                      <td>
                        {{ scene.number }} -
                        <input
                          type="text"
                          class="description"
                          v-model="scene.title"
                        />
                      </td>
                      <td>
                        <textarea
                          type="text"
                          class="description"
                          v-model="scene.description"
                        ></textarea>
                      </td>
                      <td>
                        <button
                          @click="store.deleteScene(actIndex, sceneIndex)"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <button
                        @click="store.addPlotToScene(actIndex, sceneIndex)"
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
                          />
                          <label for="">{{ plot.title }}</label>
                        </div>
                      </td>
                      <td>
                        <input
                          v-if="scene.intensity && scene.plots.length > 0"
                          type="number"
                          v-model="scene.intensity"
                          class="plot-intensity"
                        />
                      </td>
                    </tr>
                  </table>
                  <div class="create-snippet">
                    <button @click="store.insertScene('up', act, sceneIndex)">&#8593</button>
                    <button @click="store.insertScene('down', act, sceneIndex)">&#8595</button>
                  </div>
                </li>
              </draggable>
            </div>
          </ul>
        </draggable>
      </div>
    </article>
  </main>
</template>
<style>

.create-snippet {
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -25px;
  top: 25%;
  opacity: 0.5;

}
.deleteAct {
  margin: 0.5rem 0;
}
.addAct {
  width: 100px;
  margin: 0.5rem 0;
}
.plot-intensity {
  border: 1px black solid !important;
  width: 3rem;
}

.create-scene-button-container {
  display: flex;
  flex-direction: column;
}
.act-header-container {
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
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
  cursor: grabbing; /* Cambia el cursor a una mano cerrada */
}
.acts-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.act {
  width: auto;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.sceneClass {
  padding: 0.5rem;
  margin: 0.5rem;
}

.card {
  border: 1px rgba(105, 105, 105, 0.2) solid;
  box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.2);
  padding: 0 1rem;
  position: relative;

}

.create-scene {
  box-shadow: 10px 5px 5px rgba(29, 199, 230, 0.2);
}

.grabbing {
  cursor: grabbing;
}

ul {
  list-style: none;
  padding: none;
}

textarea {
  height: auto;
  min-width: 100px;
  max-width: 200px;
  max-height: 300px;
}
</style>
