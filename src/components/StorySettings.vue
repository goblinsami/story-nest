<script setup >
import { ref, computed } from 'vue';
import { useSettingsStore } from '../stores/settings';
import SceneCreator from './SceneCreator.vue';
import PlotCreator from './PlotCreator.vue';
const showEditorSettings = ref(false);

defineProps({
  mode: {
    type: String,
    default: 'text-editor',
  },
});

const store = useSettingsStore();
const { story } = store;
</script>
<template>
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
</template>