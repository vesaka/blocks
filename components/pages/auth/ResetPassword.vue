<template>
        <AuthForm name="login-form" title-image="Reset Password" :submit="onSubmit" :auth="auth">
            <div class="form-group">
                <Group type="password" :placeholder="t('reset-password.password.placeholder')" v-model="auth.password"
                    autocomplete="new-password" />
                <Group type="password" :placeholder="t('reset-password.password.placeholder')"
                    v-model="auth.password_confirmation" autocomplete="new-password" />
            </div>
            <template #footer>
                <p>
                    <RouterLink class="reg-play-link" :to="LOGIN_PATH" v-html="t('forgot-password.login', 'Login')"/>
                </p>
            </template>
            <template #redirect>
                <h2 class="text-center" v-html="t('reset-password.onSucess')"></h2>
                <p>
                    <RouterLink class="reg-play-link" :to="LOGIN_PATH" v-html="t('forgot-password.login', 'Login')"/>
                </p>
            </template>
        </AuthForm>
</template>
<script setup>

import { reactive } from 'vue';
import AuthForm from '$blocks/components/ui/AuthForm.vue';
import Group from '$blocks/components/ui/inputs/Group.vue';
import { LOGIN_PATH } from '$blocks/bootstrap/paths.js';
import api from '$core/services/express-spa-api';
import { t } from '$core/utils/i18n';
import { useRoute } from 'vue-router'

const route = useRoute();

const auth = reactive({
    email: route.query.email,
    token: route.params.token,
    password: '',
    password_confirmation: ''
});

const onSubmit = () => {
    return api.post('api/reset-password', auth);
};

</script>