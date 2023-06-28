<template>
    <NightSky> 
        <div class="flex flex-col items-center justify-center h-screen z-10 font-lucky-guy">
            <h1 class="text-4xl font-bold text-white">404</h1>
            <p class="text-white" v-html="t('404.not-exists')"></p>
            <RouterLink class="mt-4" :to="BASE">
                <GameButton class="mt-4" :content="t('404.back')"></GameButton>
            </RouterLink>
        </div>  
    </NightSky>
</template>
<script setup>
    import NightSky from '$blocks/components/ui/NightSky.vue';
    import GameButton from '$blocks/components/ui/GameButton.vue';
    import { t } from '$core/utils/i18n';
    import { BASE } from '$blocks/bootstrap/paths';
</script>
