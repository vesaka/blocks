<template>
    <label :for="id" class="flex cursor-pointer select-none items-center">
        <div class="relative">
            <input type="checkbox" :id="id" class="sr-only" v-model="checked" @change="onChange" />
            <div :class="boxClass">
                <span :class="checkClass">
                    <svg width="100%" height="100%" viewBox="0 0 11 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill="currentColor" stroke="currentColor" stroke-width="1"></path>
                    </svg>
                </span>
            </div>
        </div>
        <slot name="view">
            <span v-html="text"></span>
        </slot>

    </label>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
const $emit = defineEmits(['update:modelValue', 'change']);
let checked = ref(false);

const onChange = ev => {
    checked.value = ev.target.checked;
    $emit('update:modelValue', ev.target.checked);
};

const boxClass = computed(() => ({
    'box mr-4 flex h-8 w-8 items-center justify-center rounded-full border-4 border-coconut p-1': true,
    // 'border-gray-500': !checked.value,
    // 'border-coconut': checked.value
}));

const checkClass = computed(() => ({
    'transition-transform duration-300 text-coconut': true,
    'scale-0 rotate-180': !checked.value,
    'scale-1 rotate-0': checked.value
}));


const props = defineProps({
    id: {
        type: String,
        default: 'tick'
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