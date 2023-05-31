<template>
    <button @click="ev => toggle(ev)">
        <ArrowsPointingInIcon v-if="full" :class="icon" />
        <ArrowsPointingOutIcon v-else :class="icon" />
    </button>
</template>
<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import { icon } from '$blocks/utils/tw/button.tw';
import { toggleFullscreen, isFullscreen } from '$core/utils/fullscreen';

import {
    ArrowsPointingInIcon,
    ArrowsPointingOutIcon,
} from "@heroicons/vue/24/solid";

const rootElement = ref(null);
const full = ref(false);

const toggle = (ev) => {
    const root = ev.target.closest('#app');
    toggleFullscreen(root);

    
    setTimeout(() => {
        full.value = isFullscreen(); 
        console.log(isFullscreen());
    }, 500)
}


</script>