<template>
    <div class="flex flex-col text-white mx-4 h-20">
        <slot name="label">
            <label v-html="props.label"></label>
        </slot>
        <div class="flex flex-grow items-center justify-center">
            <slot>
                <span v-html="props.value"></span>
            </slot>
        </div>
    </div>
</template>
<script setup>
    const props = defineProps({
            label: {
                type: String,
                default: ''
            },
            value: {
                type: [String, Number],
                default: ''
            }
        });
</script>
