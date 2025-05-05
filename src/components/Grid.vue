<script setup>
import { computed, onMounted, ref } from "vue";
import { useSettingsStore } from "../stores/settings";
import Act from "./Act.vue";
import Scene from "./Scene.vue";

const store = useSettingsStore();



onMounted(() => {
    store.expandAllScenesInAllActs();
});


</script>

<template>
    <div class=" heading">
        <button @click="store.toggleShowGrid()"> Grid</button>
    </div>
    <article class="grid-container">
        <Scene v-for="scene in store.getAllScenes" :scene="scene" mode="single"  />
        

    </article>
</template>
<style>
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 5rem;
    padding: 1rem;
    height: 100vh;
    overflow-y: auto;
    overflow-x: scroll;

}


</style>