<template>
    <div class="flex flex-row w-full md:w-1/6 gap-2 absolute top-0 right-0 justify-center items-center md:items-end mx-0 md:mx-8 my-2 z-10">
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