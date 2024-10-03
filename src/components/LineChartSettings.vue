<script setup>
import { ref } from "vue";

import { useSettingsStore } from "../stores/settings";
const store = useSettingsStore();
const props = defineProps({
  data: {
    required: true,
  },
  options: {
    required: true,
  },
});

const emit = defineEmits(["changeSettings", "resetZoom"]);
</script>

<template>
  <article class="styleControls">
    <div class="chartControls">
      <label for="position">Y height</label>
      <input
        name="position"
        type="range"
        v-model="store.chartHeight"
        min="25"
        max="75"
        step="1"
      />
      <button @click="emit('resetZoom')">Reset zoom</button>
    </div>
    <div class="color-pickers">
      <div>
        Actos
        <div
          v-for="(el, index) in props.options.plugins.annotation.annotations"
        >
          <input
            type="color"
            :id="index"
            name="head"
            v-model="store.colorsHard[index]"
            @input="emit('changeSettings')"
          />
          {{ el.title }}
        </div>
      </div>
      <div style="padding: 0 1rem">
        Tramas
        <div
          v-for="(el, index) in props.data.datasets"
          v-if="props.data.datasets[0] && props.data.datasets[0].data.length"
        >
          <input
            type="color"
            :id="index"
            name="head"
            v-model="store.plotColorsHard[index]"
            @input="emit('changeSettings')"
          />
          {{ el.label }}
        </div>
      </div>
    </div>
  </article>
</template>
