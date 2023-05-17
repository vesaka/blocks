<template>
    <div class="flex flex-col w-1/2 md:w-1/6 absolute top-0 right-0 items-end px-8">
        <div class="flex items-center" v-if="auth.loggedIn">
            <div class="m-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600">
                <strong :class="tw(link, 'text-white mb-0')" v-html="auth.user.name.substr(0,2).toUpperCase()"></strong>
            </div>
            <button :class="link" @click="onLogout">
                <slot name="logout"><strong v-html="t('logout.text')"></strong></slot>
            </button>
        </div>

        <a v-else :class="link" :href="LOGIN_PATH">
            <slot name="link"><strong v-html="t('login.login')"></strong></slot>
        </a>
    </div>
</template>
<script setup>
    import { tw } from '$blocks/utils/tw';
    import { btnPrimary, btn } from '$blocks/utils/tw/button.tw';
    import { t } from '$core/utils/i18n';
    import { useAuthStore } from '$blocks/bootstrap/stores';
    import { useRouter } from 'vue-router';
    import { LOGIN_PATH } from '$blocks/bootstrap/paths';
    import api from '$blocks/bootstrap/api';

    const auth = useAuthStore();
    const router = useRouter();

    const onLogout = () => {
        auth.logout().then(() => {
            api.logout();
            router.push(LOGIN);
        });
    };
</script>