<script setup>
import { ref } from "vue";
import { useSettingsStore } from "../stores/settings";

const store = useSettingsStore();



</script>

<template>
    <div class="d-flex justify-center items-center settings">
        <button @click="store.toggleEditor()">
            {{ store.showEditor ? "Hide" : "Show" }} Editor
        </button>
        <button @click="store.togglePlotChart()">
            {{ store.showPlotChart ? "Hide" : "Show" }} Plot Chart
        </button>
        <button @click="store.toggleShowChartSettings()">
            {{ store.showChartSettings ? "Hide" : "Show" }} Chart Settings
        </button>
        <button @click="store.toggleShowCarousel()"> Carousel</button>
        <button @click="store.toggleShowGrid()"> Grid</button>

        <!--         <button @click="store.toggleExpandChart()">
            {{ store.expandChart ? "Expand" : "Contract" }} Chart Settings
        </button> -->
    </div>
    <div>
        <button @click="store.exportStoryAsJSON()">Exportar JSON</button>
        <button class="custom-file-upload">
            <label for="file-upload" class="custom-button">Importar json</label>
            <input type="file" id="file-upload" @change="store.importJSON" accept=".json" />
        </button>
    </div>
</template>
