<template>
    <label :for="id" class="flex cursor-pointer select-none items-center">
        <div class="relative w-14">
            <input :id="id" type="checkbox" class="sr-only" v-model="checked" @change="onChange">
            <div :class="bgClass"></div>
            <div :class="dotClass">
                <span :class="innerClass"></span>
            </div>
            
        </div>
        <slot>
            <span v-html="text"></span>
        </slot>
    </label>
</template>
<script setup>
    import { ref, computed, onMounted  } from 'vue';
    const $emit = defineEmits(['update:modelValue', 'change']);
    let checked = ref(false);

    const onChange = ev => {
        checked.value = ev.target.checked;
        $emit('update:modelValue', ev.target.checked);
    };

    const bgClass = computed(() => ({
            'box h-5 w-full rounded-full shadow-inner transition': true,
            'bg-dark': !checked.value,
            'bg-primary': checked.value
        }));

    const dotClass = computed(() => ({
            'dot absolute -top-1': true,
            'flex h-7 w-7 items-center justify-center': true,
            'rounded-full bg-white shadow-switch-1': true,
            'transition transition-position': true,
            'left-0': !checked.value,
            'right-0': checked.value
        }));

    const innerClass = computed(() => ({
            'active h-4 w-4 rounded-full border border-dark ': true,
            'bg-white': !checked.value,
            'bg-primary': checked.value
        }));

    const checkClass = computed(() => ({
            'opacity-0': !checked.value,
            'opacity-1': checked.value
        }));


    const props = defineProps({
        id: {
            type: String,
            default: 'switch'
        },
        text: {
            type: String,
            default: 'Check'
        },
        modelValue: {
            type: Boolean,
            default: false
        }
    });

    onMounted(() => {
        checked.value = props.modelValue;
    })


</script>