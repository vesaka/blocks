<template>
        <AuthForm title="Sign UP" class="" :submit="onSubmit">
            <div class="mt-24 md:-mt-12">
            <div class="flex flex-col md:flex-row">
                <Group name="name" class="px-2 mb-1" :input-class="inputClass" :placeholder="t('sign-up.username.placeholder', 'Enter your username')"
                    v-model="auth.name" />
                <Group name="email" class="px-2 mb-1" :input-class="inputClass" type="email" placeholder="youremail@email.com" v-model="auth.email" />
            </div>
            <div class="flex flex-col md:flex-row">
                <Group name="password" class="px-2 mb-1" :input-class="inputClass" type="password" :placeholder="t('sign-up.password.placeholder', 'Create a password')"
                    v-model="auth.password" />
                <Group name="password_confirmation" class="px-2 mb-1" :input-class="inputClass" type="password"
                    :placeholder="t('sign-up.password_confirmation.placeholder', 'Create a password')"
                    v-model="auth.password_confirmation" />
            </div>
        </div>
            <Group name="accept">
                <template #input>
                    <TickCheckbox class="pt-4 mx-auto justify-center font-lucky-guy" v-model="auth.accept" id="accept-terms">
                        <template #view>
                            <span class="text-sm" v-html="t('sign-up.accept', 'Accept terms and conditions')"></span>
                        </template>
                    </TickCheckbox>
                </template>
            </Group>
            <template #footer>
                <p class="py-4">
                    <span class="mr-1" v-html="t('sign-up.continue', 'Continue as a')"></span>
                    <RouterLink class="mr-1" :to="PLAY_PATH" v-html="t('sign-up.guest', 'guest ')"></RouterLink>
                    <span class="mr-1" v-html="t('sign-up.or', 'or ')"></span>
                    <RouterLink class="mr-1" :to="LOGIN_PATH" v-html="t('sign-up.login', 'login ')"></RouterLink>
                </p>
            </template>
            <template #redirect>
                <p class="text-center font-lucky-guy"
                    v-html="t('sign-up.check-email', 'Please check you email to confirm your registration')"></p>
            </template>
        </AuthForm>
</template>
<script setup>
import { reactive, watch } from 'vue';
import AuthForm from '$blocks/components/ui/AuthForm.vue';
import Group from '$blocks/components/ui/inputs/Group.vue';
import TickCheckbox from '$blocks/components/ui/inputs/TickCheckbox.vue';
import api from '$core/services/express-spa-api.js';
import { PLAY_PATH, LOGIN_PATH } from '$blocks/bootstrap/paths.js'
import { t } from '$core/utils/i18n';

import { useErrorStore } from '$blocks/bootstrap/stores';
const errors = useErrorStore();

const auth = reactive({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    accept: true
});

const inputClass = {'mx-auto md:w-10/12 lg:w-full': true};

watch(() => auth.accept, (c) => {
    errors.clear('accept');
})

const onSubmit = () => {
    return api.post('api/register', auth);
};

</script>
