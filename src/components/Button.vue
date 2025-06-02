<template>
    <button class="custom-button"  :title="props.tooltip" :class="{ sizeM: props.size === 'm' }">
        <Icon :icon="icon" />
        <slot></slot>
    </button>
</template>
<script setup>

const props = defineProps({
  icon: {
    required: false,
  },
  tooltip: {
    required: false,
  },
   size: {
    required: false,
  },
});
</script>

<style scoped>
.custom-button {
 font-size: 2rem;
}

.sizeM {
  font-size: 1rem;
  padding: 3px 10px;
}
</style>