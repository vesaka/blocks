<template>
    <button @click="toggleSound">
        <BellIcon v-if="store.sound" :class="icon"/>
        <BellSlashIcon v-else :class="icon"/>
    </button>
</template>
<script setup>

import Action from '$core/utils/patterns/action';
import { icon } from '$blocks/utils/tw/button.tw';
import { useGameStore } from '$blocks/bootstrap/stores';
import {
    BellIcon, BellSlashIcon
} from "@heroicons/vue/24/solid";
const store = useGameStore();

const toggleSound =() => {
    store.sound = !store.sound;
    Action.run('audio_toggle', store.sound);
};
</script>