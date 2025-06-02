<script setup>
import { ref, computed } from "vue";
import { useSettingsStore } from "../stores/settings";
import { iconsNames } from "../constants/iconsNames";


const icons = computed(() => {
    return iconsNames();
});

const store = useSettingsStore();



</script>

<template>
    <div class="d-flex justify-end settings">
        <!-- 
        <button @click="store.toggleShowChartSettings()">
            {{ store.showChartSettings ? "Hide" : "Show" }} Chart Settings
        </button> -->


        <button title="Import Json" class="custom-file-upload">
            <label for="file-upload" class="custom-button">
                <Icon :style="{ fontSize: '2rem' }" :icon="icons.import" />
            </label>

            <input type="file" id="file-upload" @change="store.importJSON" accept=".json" />
        </button>
        <Button :icon="icons.export" tooltip="Export Json" @click="store.exportStoryAsJSON()"></Button>



    </div>
</template>
