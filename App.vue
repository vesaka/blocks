<template>
    <RouterView v-slot="{ Component }" v-if="ready">
        <AuthHeader/>
        <transition
             :enter-active-class="animate.enterActive"
             :enter-from-class="animate.enterFrom"
             :enter-to-class="animate.enterTo"
             :leave-active-class="animate.leaveActive"
             :leave-from-class="animate.leaveFrom"
             :leave-to-class="animate.leaveTo">
            <component :is="Component" />
        </transition>
    </RouterView>
</template>
<script setup>
import { computed, ref } from 'vue';
import { setLocales } from '$core/utils/i18n';
import { useAuthStore } from '$blocks/bootstrap/stores';
import { HEADER_GAME_NAME } from '$blocks/bootstrap/constants';
import api from '$blocks/bootstrap/api.js';
import en from '$blocks/assets/i18n/en.json';
import env from '$blocks/bootstrap/imports.js';
import { tween } from '$blocks/utils/tw/transitions';

import AuthHeader from './components/ui/headers/AuthHeader.vue';

const animate = computed(() => {
    return tween('slide');
});

let ready = ref(false);
const auth = useAuthStore();

api.connect({
    url: env.VITE_BASE_URL,
    headers: {
        [env.VITE_GAME_HEADER_NAME]: env.VITE_GAME_KEY
    }  
}).then(() => {
    api.setBearer(auth.user.token)
        .setDefaultParams({_gk: env.VITE_GAME_KEY})
        .get('api/player')
        .catch(err => {
            if (401 === err.response.status) {
                auth.logout();
            }
        });

    ready.value = true
});

setLocales({ en });

</script>

