<template>
    <div class="flex flex-col rounded-lg bg-gray-100  mt-20 p-12  w-10/12 md:w-1/2 mx-auto">
        <slot name="header">
            <div :class="merge('header', props.header)" v-html="props.formTitle"></div>
        </slot>
        <div class="col-md-12">
            <Transition name="fade">
            <form :class="formClass" @submit.prevent="onSubmit" novalidate v-if="!didSubmit">
                <slot></slot>
                <div class="text text-danger py-2" v-html="displayError"></div>
                <button type="submit" :class="merge('sbm', props.btnSubmit)" :disabled="isLoading">
                    <slot name="submit">
                        <strong v-html="props.submitText"></strong>
                    </slot>
                </button>
                <div class="d-flex justify-content-center" v-if="isLoading">
                    <div class="spinner-border text-warning" role="status" color>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <slot name="footer"></slot>
            </form>
            </Transition>
            <Transition name="scale-in">
            <div v-if="didSubmit">
                <slot name="redirect">
                    <div class="col-md-12 home-title">
                        <img :src="asset(props.titleImage)">
                        Thank you
                    </div>
                </slot>
            </div>
            </Transition>
        </div>
    </div>
</template>
<script setup>
    import { computed, ref, watch } from 'vue';
    
    import { asset } from '$blocks/bootstrap/paths.js';
    
    import { useRouter } from 'vue-router';
    import { raw } from '$core/utils/object';   
    
    import { classProps, merge } from '$blocks/utils/class.util';
    import { useErrorStore } from '$blocks/bootstrap/stores';
    const errors = useErrorStore();
    
    const router = useRouter();
    let loading = ref(false);
    let submitted = ref(false);
    let error = ref('');

    const props = defineProps(Object.assign(classProps, {
        auth: {
            type: Object,
            default: {}
        },
        titleImage: {
            type: String,
            default: ''
        },
        formTitle: {
            type: String,
            default: ''
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
    }));
    
    watch(props.auth, (n) => {
        error.value = '';
    });

    const onSubmit = () => {
        loading.value = true;
        props.submit().then(() => {
                    //submitted.value = true;
                })
                .catch(({ response }) => {
                    
                    if ((422 === response.status)) {
                        console.log(response.data);
                        errors.update(raw(response.data));
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
