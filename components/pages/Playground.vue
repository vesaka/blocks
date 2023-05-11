<template>
   <div id="gameScreen" class="flex relative inset w-full">
        <canvas ref="canvas" class="flex fixed inset-0 -z-20" style="left: 0; right: 0;"></canvas>
        <div class="flex flex-row w-full">
            <Level/>
            <Moves/>
        </div>
    </div>
</template>
<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import BlocksGame from '$blocks/blocks-game';
    import ResizeMixin from '$core/3d/mixins/resize-mixin.js';
    import StatesMixin from '$core/mixins/states-mixin.js';

    import Level from '$blocks/components/ui/hud/Level.vue';
    import Moves from '$blocks/components/ui/hud/Moves.vue';
    
    import options from '$blocks/config/options.json';
    import settings from '$blocks/config/settings.json';
    import assets from '$blocks/config/assets.json';
    import { useGameStore, useAuthStore } from '$blocks/bootstrap/stores.js';
    
    const store = useGameStore();
    const canvas = ref(null);
    let game = null;
    onMounted(() => {
        game = new BlocksGame({
            canvas: canvas.value,
            options, settings, assets,
            $store: store,
            $auth: useAuthStore(),
            mixins: [ResizeMixin, StatesMixin]
        });
        game.load();

        setTimeout(() => game.startLevel(), 300);
    });

    onBeforeUnmount(() => {
        if (store.gameIs('playing')) {
            game.$emit('game_over');
        }
        game.destroy();
        game = null;

    });
</script>
