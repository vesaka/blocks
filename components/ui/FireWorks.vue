<template>
    <div class="flex flex-col relative w-screen h-screen items-center justify-center">
        <canvas ref="screen" class="flex fixed inset-0 bg-darkblue"></canvas>
        <slot></slot>
    </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import fireworks from '$blocks/config/fireworks.json';
import settings from '$blocks/config/settings.json';
import FireworksRenderer from '$blocks/utils/renderers/fireworks.renderer';
import ResizeMixin from '$core/3d/mixins/resize-mixin.js';
import WithMouseMoveMixin from '$core/3d/mixins/with-mouse-move-mixin';
const screen = ref(null);
let view = null;
onMounted(() => {
    view = new FireworksRenderer({
        canvas: screen.value,
        options: fireworks,
        assets: {},
        settings,
        mixins: [ResizeMixin, WithMouseMoveMixin]
    });
    view.load();

});

onBeforeUnmount(() => {
    view.destroy();
    view = null;
});
</script>