<script setup>
import {ref} from "vue";
import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();

const newCharacter = ref({title: 'New character', color: "#ff0000"})


</script>

<template>
  <div class="container">
    <textarea  name="plot-name" v-model="newCharacter.title"></textarea>
    <button @click="store.createCharacter(newCharacter.title)">Crear</button>
  </div>

      <div v-for="(character, index) in store.story.characters" class="plot-container">
       <input type="text" v-model="character.title" class="plotName">
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
}
.plot-container {
  display: flex;
}
.plotName {
  border: 1px black solid;
  padding: 0.5rem;
}
</style>
