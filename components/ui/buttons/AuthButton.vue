<template>
    <button @click="onPress">
        <ArrowRightOnRectangleIcon v-if="auth.loggedIn"  :class="icon"/>
        <ArrowLeftOnRectangleIcon v-else-if="route.path !== LOGIN_PATH"  :class="icon"/>
        <HomeIcon v-else :class="icon"/>
    </button>
</template>
<script setup>

import { useRoute } from 'vue-router';
import { useAuthStore } from '$blocks/bootstrap/stores';
import router from '$blocks/bootstrap/router';
import { LOGIN_PATH, BASE } from '$blocks/bootstrap/paths';
import { icon } from '$blocks/utils/tw/button.tw';
import api from '$blocks/bootstrap/api';

import {
    ArrowLeftOnRectangleIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon
} from "@heroicons/vue/24/solid";

const auth = useAuthStore();
const route = useRoute();
const onPress = () => {
    if (auth.loggedIn) {
        auth.logout().then(() => {
            api.logout();
            router.push(LOGIN_PATH);
        });
    } else if(route.path !== LOGIN_PATH) {
        router.push(LOGIN_PATH);
    } else {
        router.push(BASE)
    }


};
</script>