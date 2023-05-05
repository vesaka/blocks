<template>
    <NightSky>
        <div :class="container">
            <div class="flex flex-row">
                <button :class="btn" v-html="t('home.btn.play-as-guest')" v-if="!auth.loggedIn"></button>
                <button :class="btn" v-html="t('home.btn.login')" v-if="!auth.loggedIn"></button>
                <button :class="btn" v-html="t('home.btn.free-play')" v-if="auth.loggedIn"></button>
                <button :class="btn" v-html="t('home.btn.play')" v-if="auth.loggedIn"></button>
            </div>
        </div>
    </NightSky>
</template>
<script setup>
    import { useAuthStore } from '$blocks/bootstrap/stores';
    import NightSky from '$blocks/components/ui/NightSky.vue';
    import { t } from '$core/utils/i18n';
    import { container } from '$blocks/utils/tw/container.tw';
    import { btn, btnPrimary } from '$blocks/utils/tw/button.tw';
    const auth = useAuthStore();
    console.log(auth.loggedIn) 
    
</script>

