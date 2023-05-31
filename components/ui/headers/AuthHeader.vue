<template>
    <div class="flex flex-row w-1/2 md:w-1/6 absolute top-0 right-0 items-end px-8 py-2 z-10">
        <FullscreenButton/>
        <AudioButton/>
        <AuthButton/>  
    </div>
</template>
<script setup>
import FullscreenButton from '$blocks/components/ui/buttons/FullscreenButton.vue';
import AudioButton from '$blocks/components/ui/buttons/AudioButton.vue';
import AuthButton from '$blocks/components/ui/buttons/AuthButton.vue';
</script>