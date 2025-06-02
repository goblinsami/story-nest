<template>
<VueDraggableResizable :prevent-deactivation="true" :enable-native-drag="true"
  :x="x"
  :y="y"
  :w="w"
  :h="h"
  class-name="dragModal"
  drag-handle=".toolbar"
>
<!-- Dentro del modal -->
    <div class="modal-content" style="overflow: auto; height: 100%;">

  <div class="editor-area" >
    <slot />
  </div>
</div>

</VueDraggableResizable>

</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  x: { type: Number, default: 100 },
  y: { type: Number, default: 100 },
  w: { type: Number, default: 100 },
  h: { type: Number, default: 100 },
  minimized: { type: Boolean, default: false },
  maximized: { type: Boolean, default: false },

});


</script>

<style scoped>

.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  /* ← Esta línea es clave */
  overflow: hidden;
}
</style>
