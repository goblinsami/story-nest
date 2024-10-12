<script  setup>
import { ref } from "vue";
import { useSettingsStore } from "../stores/settings";
const store = useSettingsStore();

const  {act} = defineProps({
  act: {
    required: true,
  },
});
const newScene = ref({title: 'Añade nueva escena', description: 'Nueva escena'});

const createScene = (position, act) => {
  store.addScene(position, act, newScene.value)
  newScene.value.title = 'Añade nueva escena'
  newScene.value.description = 'Nueva escena'
};
</script>

<template>
  <div class="scene-creator card create-scene" id="createScene">
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
            <textarea v-model="newScene.description" ype="text" class="description"></textarea>
          </td>
          <td>
            <div class="create-scene-button-container">
              <button @click="createScene('up', act)">&#8593</button>
              <button @click="createScene('down', act)">&#8595</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
</template>
<style>
.create-scene-button-container {
  display: flex;
  flex-direction: column;
}

.create-scene {
  box-shadow: 10px 5px 5px rgba(29, 199, 230, 0.2);
}
</style>
