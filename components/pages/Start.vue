<template>
    <NightSky>

        <Card title="Home">
            <div class="flex flex-col" v-if="!auth.loggedIn">
                <RouterLink :to="PLAY_PATH">
                    <GameButton color="yellow">
                        <span v-html="t('home.btn.play-as-guest')"></span>
                    </GameButton>
                </RouterLink>
                <RouterLink :to="LOGIN_PATH">
                    <GameButton color="green">
                        <span v-html="t('home.btn.login')"></span>
                    </GameButton>
                </RouterLink>
            </div>
            <div class="flex flex-col" v-else>
                <RouterLink :to="PLAY_PATH">
                    <GameButton>
                        <span v-html="t('home.btn.free-play')"></span>
                    </GameButton>
                </RouterLink>
                <RouterLink :to="PLAY_PATH">
                    <GameButton>
                        <span v-html="t('home.btn.play')"></span>
                    </GameButton>
                </RouterLink>
            </div>

        </Card>
    </NightSky>
</template>
<script setup>
import { useAuthStore } from '$blocks/bootstrap/stores';
import NightSky from '$blocks/components/ui/NightSky.vue';
import Card from '../ui/Card.vue';
import GameButton from '$blocks/components/ui/GameButton.vue';
import { LOGIN_PATH, SIGNUP_PATH, PLAY_PATH } from '$blocks/bootstrap/paths';
import { t } from '$core/utils/i18n';
const auth = useAuthStore();


</script>

