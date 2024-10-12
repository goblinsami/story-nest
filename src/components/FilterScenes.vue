<script  setup>
import { ref, onMounted, reactive } from "vue";

import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();
const plotFilter = ref([])
const characterFilter = ref([])


</script>

<template>
  <div class="filter-container d-flex justify-around">

    <div>
            Filter by plots
                <div v-for="(plot, index) in store.story.plots">
                <input
                  type="checkbox"
                  id=""
                  name=""
                   v-model="plotFilter"
                   :value="index+ 1"
                  :style="{ accentColor: store.plotColorsHard[index] }"
                  @change="store.filterScenesByPlot()"
                />
                <label for="">{{ plot.title }}</label>
              </div>
    </div>
    <div>
            Filter by characters
                <div v-for="(character, index) in store.story.characters">
                <input
                  type="checkbox"
                  id=""
                  name=""
                   v-model="characterFilter"
                   :value="character.title"
                  :style="{ accentColor: store.story.characters[index].color }"
                  @change="store.filterAndUpdateScenesByCharacters(characterFilter)"

                />
                <label for="">{{ character.title }}</label>
              </div>
    </div>
  </div>
</template>

<style >
.filter-container {
  padding: 1rem;
}
</style>
