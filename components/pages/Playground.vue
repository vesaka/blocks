<template>
   <div id="gameScreen" class="d-flex position-relative w-100">
        Let's Play
        <canvas ref="canvas" class="d-flex position-fixed inset-0 -z-20" style="left: 0; right: 0;"></canvas>
    </div>
</template>
<script setup>
    import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
    import BlocksGame from '$blocks/blocks-game';
    import ResizeMixin from '$core/3d/mixins/resize-mixin.js';
    import StatesMixin from '$core/mixins/states-mixin.js';
    
    import options from '$blocks/config/options.json';
    import settings from '$blocks/config/settings.json';
    import assets from '$blocks/config/assets.json';
    import { useGameStore, useAuthStore } from '$blocks/bootstrap/stores.js';
    
    import {raw} from '$core/utils/object.js';
    
    const store = useGameStore();
    const key = ref(0);
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
    });

    onBeforeUnmount(() => {
        if (store.gameIs('playing')) {
            game.$emit('game_over');
        }
        game.destroy();
        game = null;

    });
</script>
