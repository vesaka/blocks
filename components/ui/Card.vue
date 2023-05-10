<template>
    <div :class="tw(container, 'relative')">
        <div :class="cardClass" style="transform: perspective(100px) rotateX(-2deg);">
            <div :class="innerCard"></div>
        </div>
        <CardTitle class="w-5/6 absolute -top-28 sm:-top-24 md:-top-32" fill="#ff9955" :title="props.title"/>
        <div class="flex flex-col absolute ">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import { tw } from '$blocks/utils/tw';
import { container } from '$blocks/utils/tw/container.tw';
import CardTitle from '../ui/CardTitle.vue';

const props = defineProps({
    title: {
        type: String
    }
});
const cardClass = {
    'absolute': true,
    'bg-coconut p-4': true,
    'border-jasperorange': true,
    'rounded-lg  w-full h-full': true,
    'transform-bottom': true,
};

const innerCard = {
    'flex flex-row bg-inyellow w-full h-full rounded-lg': true,
    'border-2 border-jasperorange': true,
    'rounded-lg shadow-sm': true
};
</script>