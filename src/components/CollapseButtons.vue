<script  setup>
import { useSettingsStore } from "../stores/settings";
import { ref, watch, onMounted, computed } from "vue";
const store = useSettingsStore();
const { story } = store;

const  props = defineProps({
  mode: {
    required: true,
    default: 'text-editor'
  },
    actIndex: {
    required: false,
    default: 0
  },
});
</script>

<template>
      <button @click="store.collapseAllScenes(mode, actIndex)"> Collapse </button>
      <button @click="store.expandAllScenes(mode, actIndex)"> Expand  </button>
</template>
