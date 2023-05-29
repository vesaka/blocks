<template>
    <NightSky class="text-white font-lucky-guy">

        <h2 class="text-white font-lucky-guy text-4xl z-10">Leaderboard</h2>
        <div class="flex flex-col z-10" v-if="players">
            <div class="flex flex-col" v-if="players.length > 0">
                <div :class="rowClass" v-for="(item, i) in players">
                    <strong v-html="i + 1"></strong>.
                    <strong class="flex-grow mx-2" v-html="item.player.name"></strong>
                    <strong v-html="item.score"></strong>
                </div>
            </div>
            <div v-else>No Results Yet</div>
        </div>
    </NightSky>
</template>
<script setup>
import { reactive, computed } from 'vue';
import { useGameStore } from '$blocks/bootstrap/stores';
import api from '$blocks/bootstrap/api';
import NightSky from '$blocks/components/ui/NightSky.vue';

const rowClass = {
    'flex flex-row': true,
    'py-2 px-6 my-2': true,
    'border-2 border-coconut rounded-full': true,
    'bg-jasperorange': true,
    'text-coconut text-xl': true,
    'w-full': true
}
const gameStore = useGameStore();

const players = gameStore.players;
console.log(players);
const getPlayers = () => {
    api.get('api/leaderboard')
    .then(res => {
        gameStore.players = res.data;
    });
};

if (!players) {
    getPlayers();
}

//setInterval(getPlayers, 60000);

</script>
