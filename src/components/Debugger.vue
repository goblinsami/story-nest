<template>
    <div
        :style="{ zIndex: '999999999999999999999999999999', color: 'black', backgroundColor: 'rgba(200,200,200,0.8)', position: 'absolute', bottom: '0', right: '0', border: '1px solid red', width: '400px', height: '300px' }">
<button @click="store.showDebugger = false">hide</button>
        <pre>{{ store.selectedSegmentIndex }}</pre>
        <button @click="store.clearActHoverSelection()">test</button>

    </div>

</template>


<script setup>
import { useSettingsStore } from "../stores/settings";
import { computed } from "vue";
const store = useSettingsStore();
import { positionsConstants } from "../constants/positions";
import { useLineChart } from "../composables/useLineChart";

const { hideTooltips, selectionTooltip } = useLineChart(null, null, null, null);
const positions = computed(() => {
    return positionsConstants();
});
</script>

<style scoped></style>
