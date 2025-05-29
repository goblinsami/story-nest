<script setup>
import { useSettingsStore } from "../stores/settings";
const store = useSettingsStore();

const props = defineProps({
  visible: Boolean,
  x: Number,
  y: Number,
  type: String,
  data: Object,
  expand: Boolean
});
</script>

<template>
  <div v-if="visible && store.isToolTipHidden" class="tooltip" :style="{
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`
  }">
    <!-- Aquí tu contenido, por ejemplo: -->
    <div v-if="type === 'scene'">
      <strong>{{ data?.index }}: {{ data?.title }}</strong><br>
      <p v-if="expand">{{ data?.desc }}</p>
      <div v-if="data?.characters?.length">
        <span v-for="char in data.characters" :key="char">
          <strong :style="{ color: store.getCharacterColor(char) }">{{ char }} </strong><br>
        </span>
      </div>
      <div v-for="plot in data.plots" :key="plot">
        <strong :style="{ color: store.getPlotColor(plot) }">{{ store.getPlotInfo(plot).title }}</strong>

      </div>
    </div>
    <div v-if="type === 'character'">
      <strong :style="{ color: store.getCharacterColor(data) }">{{ data }} </strong><br>
    </div>
    <div v-if="type === 'plot'">
      <strong :style="{ color: store.getPlotColor(data.id) }">
        {{ data.title }}
      </strong>
    </div>
    <div v-if="type === 'segment'">
      <strong> {{ data.title }}</strong>
      <p> {{ data.sceneCount }} escenas </p>
    </div>
  </div>
</template>
