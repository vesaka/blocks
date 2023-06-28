<template>
        <AuthForm title="Log In" name="login-form" :submit="onSubmit" form-title="Login">
            <div class="form-group">
                <Group :placeholder="t('login.name.placeholder')" name="email" type="text" v-model="auth.email"></Group>
                <Group :placeholder="t('login.password.placeholder')" name="password" type="password" v-model="auth.password"></Group>
            </div>
            <template #footer>
                <TickCheckbox class="pt-4 mx-auto justify-center" v-model="auth.remember" :text="t('login.remember')" />
                <p class="pt-4 text-center">
                    <RouterLink :to="SIGNUP_PATH" v-html="t('login.with-account')"></RouterLink>
                </p>
                <p class="pt-4 text-center" v-if="true">
                    <RouterLink :to="FORGOT_PASSWORD" v-html="t('login.forgot-password')"></RouterLink>
                </p>
            </template>
        </AuthForm>
</template>
<script setup>
import { reactive } from 'vue';
import AuthForm from '$blocks/components/ui/AuthForm.vue';
import Group from '$blocks/components/ui/inputs/Group.vue';
import TickCheckbox from '$blocks/components/ui/inputs/TickCheckbox.vue';
import api from '$blocks/bootstrap/api.js';
import { raw } from '$core/utils/object.js';
import { t } from '$core/utils/i18n';
import { FORGOT_PASSWORD, PLAY_PATH, SIGNUP_PATH } from '$blocks/bootstrap/paths';
import { useAuthStore } from '$blocks/bootstrap/stores';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();

const auth = reactive({
    email: '',
    password: '',
    remember: false
});

const router = useRouter();

const onSubmit = () => {

    return api.post('api/login', raw(auth), { withCredentials: true })
        .then(({ data }) => {
            api.setBearer(data.token);
            data.isGuest = false;
            authStore.login(data);
            router.push(PLAY_PATH);
        });
};
</script>



