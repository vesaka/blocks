<template>
    <Display label="Level">
        <em v-html="gameStore.level.current"></em>
        <em>/</em>
        <em v-html="game.level.max"></em>
    </Display>
</template>
<script setup>
    import Display from './Display.vue';
    import { useGame } from '$blocks/utils/game.util';
    import { game } from '$blocks/config/options.json';

    const { gameStore } = useGame();
</script>