<script setup>
import { useSettingsStore } from "../stores/settings";
import { VueDraggableNext } from "vue-draggable-next";
import { defineComponent, ref, watch } from "vue";

const store = useSettingsStore();

const draggable = VueDraggableNext;

const { story } = store;

const dragging = ref(false);

const localData = ref({});

const newScene = ref({title: 'Añade nueva escena', description: 'Nueva escena'});


const createScene = (position, act) => {
  console.log(position, act, newScene.value)
  store.addScene(position, act, newScene.value)
  newScene.value.title = 'Añade nueva escena'
  newScene.value.description = 'Nueva escena'
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

      <div class="">
        <draggable
          v-model="localData.acts"
          @start="onStart"
          @end="onEnd"
          class="acts-container"
          group="acts"
        >
          <ul v-for="act in localData.acts" class="card">
            <div class="act-header-container">
              <input type="text" class="title" v-model="act.title" />
              <h2>
                <button>+</button><span>{{ act.scenes.length }}</span>
              </h2>
            </div>
            <div class="act">
              <draggable
                v-model="act.scenes"
                @start="onStart"
                @end="onEnd"
                group="scenes"
              >
                              <li class="sceneClass card">
                  <table>
                    <tr>
                      <td>
                        + -
                        <input
                          type="text"
                          class="description"
                          v-model="newScene.title"
                        />
                      </td>
                      <td>
                        <textarea t v-model="newScene.description" ype="text" class="description"></textarea>
                      </td>
                      <td>
                        <div class="create-scene-button-container">
                          <button @click="createScene('up', act)">&#8593</button>
                          <button @click="createScene('down', act)">&#8595</button>
                        </div>
                      </td>
                    </tr>
                  </table>
                </li>
                <li
                  v-for="(scene, index) in act.scenes"
                  class="sceneClass card"
                  :class="dragging ? 'grabbing' : ''"
                >
                  <table>
                    <tr>
                      <td>
                        {{ index + 1 }} -
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
                    </tr>
                  </table>
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

.create-scene-button-container{
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
  justify-content: center;
  flex-direction: column;
  text-align: center;
  width: 50%;
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
  flex-direction: row;
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
