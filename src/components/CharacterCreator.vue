<script setup>
import {ref} from "vue";
import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();

const newCharacter = ref({title: 'New character', color: "#ff0000"})


</script>

<template>
  <div class="container">
    <textarea  name="plot-name" v-model="newCharacter.title"  class="plotName"></textarea>
    <button @click="store.createCharacter(newCharacter.title)">Crear</button>
  </div>

      <div v-for="(character, index) in store.story.characters" class="plot-container w-100">
       <textarea type="text" v-model="character.title" class="plotName"></textarea>
           <input
            type="color"
            :id="actIndex"
            name="head"
            v-model="character.color"
            class="plot-color-sample"
          />
       <button @click="store.deleteCharacter(index)">X</button>
      </div>
</template>
<style>


.container {
  padding: 1rem 0;
  display: flex;
  background-color: var(--color-dark-bg) !important;
  background: none;
  width: 100%;
}

.plot-container {
  display: flex;
}

.plotName {
  border: 1px black solid;
  padding: 0.5rem;
  background: none;
  color: var(--color-light-text) !important;
  border: 1px var(--color-light-text) solid!important;
    width: 100%;


}
</style>
