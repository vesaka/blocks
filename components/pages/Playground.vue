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
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import BlocksGame from '$blocks/blocks-game';
    import ResizeMixin from '$core/3d/mixins/resize-mixin.js';
    import StatesMixin from '$core/mixins/states-mixin.js';

    import Level from '$blocks/components/ui/hud/Level.vue';
    import Moves from '$blocks/components/ui/hud/Moves.vue';
    
    import options from '$blocks/config/options.json';
    import settings from '$blocks/config/settings.json';
    import assets from '$blocks/config/assets.json';
    import { FINISHED, FREE_PLAY, COMPETITION } from '$blocks/bootstrap/constants';
    import { LEVELS_PATH, SUCCESS_PATH } from '$blocks/bootstrap/paths';
    import { useGameStore, useAuthStore } from '$blocks/bootstrap/stores.js';
    
    const store = useGameStore();
    const router = useRouter();
    const route = useRoute();
    const canvas = ref(null);
    let game = null;

    watch(() => store.state, (state) => {
        
        if (FINISHED === state) {
            const { redirects } = route.meta;

            if (redirects[store.mode]) {
                router.push(redirects[store.mode]);
            }
        }

        

    })
    onMounted(() => {
        game = new BlocksGame({
            canvas: canvas.value,
            options, settings, assets,
            $store: store,
            $auth: useAuthStore(),
            mixins: [ResizeMixin, StatesMixin]
        });
        game.load();
        if (game) {
            setTimeout(() => game.startLevel(store.level.current), 300);
        }
        
    });

    onBeforeUnmount(() => {
        if (store.gameIs('playing')) {
            game.$emit('game_over');
        }
        game.destroy();
        game = null;

    });
</script>
