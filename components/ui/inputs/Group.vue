<template>
    <div class="mb-4">
        <label :class="merge('label', props.label)" v-if="title">
            <slot name="title">
                <strong v-html="title"></strong>
            </slot>
        </label>
        <slot name="input">
            <input :class="merge(input, props.input)"
                   :type="type" :placeholder="placeholder" :value="props.modelValue"
                   @input="onInput"/>
        </slot>
        <slot name="error">
            <div :class="merge('invalid', props.invalid)" v-html="errors.first(name)"></div>
        </slot>
    </div>
</template>
<script setup>
    import { onMounted } from 'vue';
    import { classProps, merge } from '$blocks/utils/class.util';
    import { input } from '$blocks/utils/tw/input.tw';
    import { useErrorStore } from '$blocks/bootstrap/stores';
    const errors = useErrorStore();
    
    const $emit = defineEmits(['update:modelValue']);
    const props = defineProps(Object.assign(classProps, {
        type: {
            type: String,
            default: 'text',
            validate(t) {
                return [
                    'text', 'email', 'checkbox',
                    'radio', 'date', 'tel',
                    'number', 'password'
                ].includes(t);
            }
        },
        name: {
            type: String,
            default: ''
        },
        modelValue: {
            type: [String, Number],
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        }
    }));
    
    const onInput = ev => {
        errors.clear(props.name);
        $emit('update:modelValue', ev.target.value)
    };
    
</script>
