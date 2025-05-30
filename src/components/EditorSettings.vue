<!-- src/components/EditorSettings.vue -->
<template>
  <div class="settings-container p-1" v-if="show">
    <div class="w-100">
      <textarea type="text" class="title" v-model="modelValue.title" maxlength="50" />
      <textarea class="sub-title title" v-model="modelValue.description" />
    </div>

    <button @click="store.addAct()" class="addAct">Añadir acto</button>
    <button @click="store.addNumeration()" class="addAct">Numerar</button>

    <button @click="togglePlotEditor" class="addAct">Tramas</button>
    <button @click="toggleCharacterEditor" class="addAct">Personajes</button>

    <button @click="store.deleteStory()" class="addAct">Borrar todo</button>

    <PlotCreator v-if="showPlotEditor" class="plot-creator" />
    <CharacterCreator v-if="showCharacterEditor" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSettingsStore } from '../stores/settings';
import PlotCreator from './PlotCreator.vue';
import CharacterCreator from './CharacterCreator.vue';

const props = defineProps({
  modelValue: Object,
  show: Boolean,
});
const emit = defineEmits(['update:modelValue']);

const store = useSettingsStore();
const showPlotEditor = ref(false);
const showCharacterEditor = ref(false);

const togglePlotEditor = () => {
  showPlotEditor.value = !showPlotEditor.value;
  showCharacterEditor.value = false;
};

const toggleCharacterEditor = () => {
  showCharacterEditor.value = !showCharacterEditor.value;
  showPlotEditor.value = false;
};
</script>
