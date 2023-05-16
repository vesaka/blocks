<template>
        <AuthForm name="login-form" :submit="onSubmit" form-title="Login">
            <div class="form-group">
                <Group :placeholder="t('login.name.placeholder')" name="email" type="text" v-model="auth.email"></Group>
                <Group :placeholder="t('login.password.placeholder')" name="password" type="password"
                    v-model="auth.password"></Group>
            </div>
            <template #footer>
                <TickCheckbox class="pt-4 mx-auto justify-center" v-model="auth.remember"
                    :text="t('login.remember', 'Remember me')" />
                <p class="pt-4 text-center">
                    <RouterLink :class="link" :to="SIGNUP_PATH"
                        v-html="t('login.with-account', 'Have an Account? Click Here')"></RouterLink>
                </p>
                <p class="pt-4 text-center" v-if="true">
                    <RouterLink :class="link" :to="FORGOT_PASSWORD"
                        v-html="t('login.forgot-password', 'Forgot your password?')"></RouterLink>
                </p>
            </template>
        </AuthForm>
</template>
<script setup>
import { reactive, watch } from 'vue';
import AuthForm from '$blocks/components/ui/AuthForm.vue';
import Group from '$blocks/components/ui/inputs/Group.vue';
import TickCheckbox from '$blocks/components/ui/inputs/TickCheckbox.vue';
import api from '$blocks/bootstrap/api.js';
import { raw } from '$core/utils/object.js';

import { t } from '$core/utils/i18n';
import { FORGOT_PASSWORD, BASE, PLAY_PATH, SIGNUP_PATH } from '$blocks/bootstrap/paths';
import { useAuthStore } from '$blocks/bootstrap/stores';
import { useRouter } from 'vue-router';
import { link } from '$blocks/utils/tw/button.tw';
const authStore = useAuthStore();

const auth = reactive({
    email: 'admin',
    password: 'veskracve',
    remember: false
});

const router = useRouter();
console.log(authStore.user);
const onSubmit = () => {

    return api.post('api/login', raw(auth), { withCredentials: true })
        .then(({ data }) => {
            api.setBearer(data.token);
            data.isGuest = false;
            authStore.login(data);
            // router.push(PLAY_PATH);
        });
};
</script>



