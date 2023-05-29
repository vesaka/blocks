<template>
    <div class="flex flex-col w-1/2 md:w-1/6 absolute top-0 right-0 items-end px-8 z-10">
        <div class="flex items-center" v-if="auth.loggedIn">
            <div class="m-3 flex h-12 w-12 text-white items-center justify-center rounded-full border-2 border-coconut">
                <strong v-html="auth.user.name.substr(0,2).toUpperCase()"></strong>
            </div>
            <button @click="onLogout" class="text-white">
                <slot name="logout"><BackwardIcon class="h-6 w-6"/></slot>
            </button>
        </div>

        <a v-else :class="link" :href="LOGIN_PATH">
            <slot name="link"><strong v-html="t('login.login')"></strong></slot>
        </a>
    </div>
</template>
<script setup>
    import { tw } from '$blocks/utils/tw';
    import { btnPrimary, btn, link } from '$blocks/utils/tw/button.tw';
    import { t } from '$core/utils/i18n';
    import { useAuthStore } from '$blocks/bootstrap/stores';
    import { useRouter } from 'vue-router';
    import { LOGIN_PATH } from '$blocks/bootstrap/paths';
    import api from '$blocks/bootstrap/api';

    import { BackwardIcon } from "@heroicons/vue/24/solid";




    const auth = useAuthStore();
    const router = useRouter();

    const onLogout = () => {
        auth.logout().then(() => {
            api.logout();
            router.push(LOGIN);
        });
    };
</script>