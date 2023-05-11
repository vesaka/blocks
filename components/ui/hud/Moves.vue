<template>
    <Display label="Moves">
        <strong ref="counter" v-html="moves"></strong>
    </Display>
</template>
<script setup>
import { watch, computed, ref } from 'vue';
import Display from './Display.vue';
import { useGame } from '$blocks/utils/game.util';
import { game } from '$blocks/config/options.json';
import gsap from 'gsap';

const counter = ref(null);
const { gameStore } = useGame();
let moves = computed(() => gameStore.level.moves);
watch(() => gameStore.level.moves, n => {
    //moves = n;
    const tl  = gsap.timeline({defaults: {
        duration: 0.3,
        repeat: 0
    }})
    .to(counter.value, {
        scale: 2
    })
    .add(() => {
        moves = n
        console.log(tl.progress())
    })
    .to(counter.value, {
        scale: 1
    })

} );

</script>