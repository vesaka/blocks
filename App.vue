<template>
    <RouterView v-slot="{ Component, route }" v-if="ready">
        <transition>
            <component :is="Component" />
        </transition>
    </RouterView>
</template>
<script setup>
    import { computed, onMounted, reactive, ref } from 'vue';
    import { useAuthStore } from './bootstrap/stores';
    import api from '$blocks/bootstrap/api.js';
    import { setLocales } from '$core/utils/i18n';
    import en from './assets/i18n/en.json';
    import env from '$blocks/bootstrap/imports.js';

    let ready = ref(false);
    const auth = useAuthStore();
    // api.setBaseUrl(env.VITE_BASE_URL)
    //     .handshake();
    api.connect({
        url: env.VITE_BASE_URL,
        csrfPath: 'sanctum/csrf-cookie'
    }).then(() => {
        ready.value = true
    });
    setLocales({en});

</script>

