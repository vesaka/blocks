<template>
        <div :class="`pushable ${props.color}`">
            <span class="shadow"></span>
            <span class="edge"></span>
            <span class="front text-red-900">
                <span class="btn-overlay top"></span>
                <span class="btn-overlay bottom"></span>
                <div class="relative">
                    <slot></slot>
                </div>
                
            </span>
        </div>
</template>
<script setup>
const props = defineProps({
    color: {
        type: String,
        default: 'red'
    }
});

</script>