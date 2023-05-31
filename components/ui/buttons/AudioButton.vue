<template>
    <button @click="store.sound = !store.sound">
        <BellIcon v-if="store.sound" :class="icon"/>
        <BellSlashIcon v-else :class="icon"/>
    </button>
</template>
<script setup>
import { icon } from '$blocks/utils/tw/button.tw';
import { useGameStore } from '$blocks/bootstrap/stores';
import {
    BellIcon, BellSlashIcon
} from "@heroicons/vue/24/solid";
const store = useGameStore();
</script>