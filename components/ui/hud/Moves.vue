<template>
    <Display label="Moves">
        <strong ref="counter" v-html="store.level.moves"></strong>
    </Display>
</template>
<script setup>
import { watch, computed, ref } from 'vue';
import Display from './Display.vue';
import { useGameStore } from '$blocks/bootstrap/stores.js';
import { TimelineMax  } from 'gsap/all ';

const counter = ref(null);
const store = useGameStore();

const timeline = new TimelineMax ({
    defaults: {
        duration: 0.3,
        repeat: 0
    }
});
watch(() => store.level.moves, () => {
    timeline.to(counter.value, {
        scale: 2
    })
    .to(counter.value, {
        scale: 1
    })
} );
</script>