<template>
  <vue-draggable-resizable  class-name-active="activeModal" :x="x"
    :y="y" :w="w" :h="h" :draggable="!maximized"
    :resizable="!maximized" class-name="dragModal">
    <div class="modal-content" style="overflow: auto; height: 100%;">
     <div class="toolbar">
      <slot name="toolbar">
      </slot>
     </div>
      <slot >
      </slot>
      <slot>
      </slot>
    </div>
  </vue-draggable-resizable>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import VueDraggableResizable from 'vue-draggable-resizable'

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

.toolbar {
  background-color: red
}
.modal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%; /* ← Esta línea es clave */
  overflow: hidden;
}</style>
