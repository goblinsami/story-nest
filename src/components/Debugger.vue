<template>
    <div
        :style="{ color: 'black', backgroundColor: 'rgba(200,200,200,0.8)', position: 'absolute', bottom: '0', right: '0', border: '1px solid red', width: '200px', height: '200px' }">
        {{ store.textEditorIsDettached }} -- {{ store.editorWidth }}
        {{ store.textEditorPosition }}

    </div>

</template>


<script setup>
import { useSettingsStore } from "../stores/settings";
const store = useSettingsStore();

</script>

<style scoped></style>
