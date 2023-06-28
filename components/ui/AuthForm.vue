<template>
    <NightSky>
        <Card :title="title" class="mt-20 p-12 md:h-2/3 w-10/12 md:w-1/2 mx-auto z-10 text-coconut">
            <Transition name="fade">
                <form :class="formClass" @submit.prevent="onSubmit" novalidate v-if="!didSubmit">
                    <slot></slot>
                    <div class="text text-danger py-2" v-html="displayError"></div>
                    <button type="submit" :disabled="isLoading">
                        <GameButton>
                            <strong v-html="props.submitText"></strong>
                        </GameButton>
                    </button>
                    <div class="d-flex justify-content-center" v-if="isLoading">
                        <div class="spinner-border text-warning" role="status" color>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div class="font-lucky-guy text-sm">
                        <slot name="footer"></slot>
                    </div>

                </form>
            </Transition>
            <Transition name="scale-in">
                <div class="text-4xl w-3/4 mx-auto" v-if="didSubmit">
                    <slot name="redirect">
                        <div class="text-center font-lucky-guy text-coconut">
                            Thank you
                        </div>
                    </slot>
                </div>
            </Transition>
        </Card>
    </NightSky>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { t } from '$core/utils/i18n';
import { isObject } from '$core/utils/object';
import { useErrorStore } from '$blocks/bootstrap/stores';
import Card from '$blocks/components/ui/Card.vue';
import GameButton from './GameButton.vue';
import NightSky from '$blocks/components/ui/NightSky.vue';
const errors = useErrorStore();

let loading = ref(false);
let submitted = ref(false);
let error = ref('');

const props = defineProps({
    auth: {
        type: Object,
        default: {}
    },
    title: {
        type: String,
        default: 'Title'
    },
    name: {
        type: String,
        default: ''
    },
    submit: {
        type: Function,
        default: () => {
        }
    },
    submitText: {
        type: String,
        default: 'Submit'
    },
});

watch(() => props.auth, (n) => {
    error.value = '';
});

const onSubmit = () => {
    loading.value = true;
    props.submit().then(() => {
        submitted.value = true;
    }).catch(({ response }) => {
        if ((422 === response.status)) {
            const newErrors = {};
            for (let name in response.data.errors) {
                const error = response.data.errors[name];
                const rule = isObject(error[0]) ? error[0].rule : error[0]; 
                newErrors[name] = t(`messages.${name}.${rule}`)
            }
            errors.update(newErrors);
        }
    })
        .then(() => {
            loading.value = false
        })
};

const displayError = computed(() => { return error.value; });
const isLoading = computed(() => { return loading.value; });
const didSubmit = computed(() => { return submitted.value; });

const formClass = computed(() => ({
    'register-form text-center': true,
    [props.name]: true
}));
</script>
