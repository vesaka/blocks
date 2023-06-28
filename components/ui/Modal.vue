<template>
    <transition
        enter-active-class="ease-out duration-300"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-class="opacity-100"
        leave-to-class="opacity-0">
        <div
            v-show="renderOverlay"
            :class="md.backdrop"
            @click="toggle(false)">
            <transition
                enter-active-class="ease-out duration-300"
                enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to-class="opacity-100 translate-y-0 sm:scale-100"
                leave-active-class="ease-in duration-200"
                leave-class="opacity-100 translate-y-0 sm:scale-100"
                leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
            <div @click.stop="toggle(true)" :class="merge('wrapper')">
                <div :class="merge('header')">
                    <slot name="header">
                        <h3 :class="md.title">

                        </h3>
                    </slot>
                </div>

                <div :class="merge('body')">
                    <slot name="body">

                    </slot>
                </div>
                <div :class="merge('footer')">
                    <slot name="footer">

                    </slot>
                </div> 
            </div>
                </transition>
        </div>
    </transition>
</template>
<script setup>
    import { ref, onMounted, watch } from 'vue';
    import { tw }  from '$blocks/utils/tw';
    import * as md from '$blocks/utils/tw/modal.tw';

    const visible = ref(false);
    const renderOverlay = ref(false);
    const renderModal = ref(false);
    const $emit = defineEmits(['modal:close', 'modal:open']);
    const props = defineProps({
        show: {
            type: Boolean,
            default: false
        },
        classes: {
            type: [Object, String],
            default: () => ({})
        }
    });

    watch(visible, show => {
        if (show) {
            renderOverlay.value = true;
            setTimeout(() => renderModal.value = true, 200);
        } else {
            renderModal.value = false;
            setTimeout(() => renderOverlay.value = false, 100);
        }
    });

    const merge = (key) => {
        return tw(md[key], props.classes[key]);
    };

    const toggle = state => visible.value = !!state;

    onMounted(() => {
        visible.value = props.show;
        
    });

</script>
