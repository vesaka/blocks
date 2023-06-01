<template>
    <NightSky class="text-white font-lucky-guy">

        <h2 class="text-white font-lucky-guy text-4xl z-10" v-html="t('leaderboard.title')"></h2>
        <div class="flex flex-col z-10" v-if="players">
            <div class="flex flex-col" v-if="players.length > 0">
                <div :class="rowClass" v-for="(item, i) in players">
                    <strong v-html="i + 1"></strong>.
                    <strong class="flex-grow mx-2" v-html="item.player.name"></strong>
                    <strong v-html="item.score"></strong>
                </div>
            </div>
            <div v-else v-html="t('leaderboard.empty')"></div>
        </div>

        <div class="flex flex-col md:flex-row mt-4">
            <GameButton :content="t('leaderboard.restart')" @click="startLevel(gameStore.level.current)" color="yellow"
                class="mx-2"></GameButton>
            <GameButton :content="t('leaderboard.select')" @click="goToLevelsScreen" color="red" class="mx-2"></GameButton>
        </div>
    </NightSky>
</template>
<script setup>
import { computed, onBeforeMount, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGameStore } from '$blocks/bootstrap/stores';

import { t } from '$core/utils/i18n';
import api from '$blocks/bootstrap/api';
import NightSky from '$blocks/components/ui/NightSky.vue';
import GameButton from '$blocks/components/ui/GameButton.vue';
import { startLevel, goToLevelsScreen } from '$blocks/utils/level.util';

const rowClass = {
    'flex flex-row': true,
    'py-2 px-6 my-2': true,
    'border-2 border-coconut rounded-full': true,
    'bg-jasperorange': true,
    'text-coconut text-xl': true,
    'w-full': true
}
const gameStore = useGameStore();

const players = computed(() => gameStore.players);

const getPlayers = () => {
    api.get('api/leaderboard')
        .then(res => {
            gameStore.players = res.data;
        });
};



let getPlayersIntevalId;

onBeforeMount(() => {
    if (!players.value) {
        getPlayers();
    }

    getPlayersIntevalId = setInterval(getPlayers, 60000);
});

onBeforeUnmount(() => {
    clearInterval(getPlayersIntevalId)
});
</script>
