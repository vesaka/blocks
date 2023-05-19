<template>
    <NightSky>
        <Card title="Home">
            <RouterLink :to="PLAY_PATH" class="mb-4 text-center">
                <GameButton color="yellow" :content="t('home.btn.play')"/>
            </RouterLink>
            <RouterLink :to="LEVELS_PATH" class="mb-4 text-center">
                <GameButton color="yellow" :content="t('home.btn.select')"/>
            </RouterLink>
            <RouterLink :to="LOGIN_PATH" class="mb-4 text-center" v-if="!auth.loggedIn">
                <GameButton color="red" :content="t('home.btn.login')"/>
            </RouterLink>
            <RouterLink :to="PLAY_PATH" class="mb-4 text-center" v-else>
                <GameButton :content="t('home.btn.free-play')"/>
            </RouterLink>
        </Card>
    </NightSky>
</template>
<script setup>
import { useAuthStore } from '$blocks/bootstrap/stores';
import NightSky from '$blocks/components/ui/NightSky.vue';
import Card from '../ui/Card.vue';
import GameButton from '$blocks/components/ui/GameButton.vue';
import { LOGIN_PATH, SIGNUP_PATH, PLAY_PATH, LEVELS_PATH } from '$blocks/bootstrap/paths';
import { t } from '$core/utils/i18n';
const auth = useAuthStore();


</script>

