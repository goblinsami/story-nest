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

const selectedPalette = ref(0);
const emit = defineEmits(["changeSettings", "resetZoom"]);
</script>

<template>
  <article class="styleControls d-flex items-center">
    <div class="chartControls d-flex">
      <label for="position">Y height</label>
      <input
        name="position"
        type="range"
        v-model="store.chartHeight"
        min="25"
        max="75"
        step="1"
      />
        <label for="fontSize">fontSize</label>
      <input
        name="fontSize"
        type="range"
        v-model="store.chartFontSize"
        min="12"
        max="48"
        step="1"
      />
      {{ store.chartFontSize }}
      <button @click="emit('resetZoom')">Reset zoom</button>
    </div>
    <div class="color-pickers">
      <div>
        Actos
        <div v-for="(el, index) in store.story.acts">
          <input
            type="color"
            :id="index"
            name="head"
            v-model="el.color"
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
      <div>
<!--         <div
          v-for="(palette, index) in store.colorPalettes"
          :value="index"
          class="palette-selector"
        >
          <div class="d-flex color-optionn justify-end">
            <span>{{ palette.name }}</span>
            <input
              type="radio"
              id=""
              name=""
              v-model="selectedPalette"
              :value="index"
              @change="store.changePalette(selectedPalette)"
            />
            <div class="option-color-sample" v-for="color in palette.colors" :style="{backgroundColor: color}">
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </article>
</template>
<style>

.color-option {


}
.palette-selector {
  display: flex;
  flex-direction: column;
  width: 600px;
}
.option-color-sample {
  width: 20px;
  height: 20px;
}
.chartControls {
  flex-direction: column;
  padding: 0.5rem;
}
.color-pickers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0.5rem;
}

.styleControls {
  padding: 1rem;
}
.styleControls input {
  border: 1px black solid !important;
}
</style>
