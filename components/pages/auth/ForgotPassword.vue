<template>
    <AuthForm name="login-form" title="New Password" :submit="onSubmit" :auth="auth">
        <Group name="email" class="px-2 mb-1" type="email" placeholder="youremail@example.com" v-model="auth.email" />
        <template #footer>
            <p>
                <RouterLink class="font-lucky-guy" :to="LOGIN_PATH" v-html="t('forgot-password.login', 'Login')" />
            </p>
        </template>
        <template #redirect>
            <h2 class="text-center font-lucky-guy" v-html="t('forgot-password.check')"></h2>
            <p class="text-center">
                <RouterLink class="font-lucky-guy" :to="LOGIN_PATH" v-html="t('forgot-password.login', 'Login')" />
            </p>
        </template>
    </AuthForm>
</template>
<script setup>

import { reactive } from 'vue';
import { LOGIN_PATH } from '$blocks/bootstrap/paths.js'
import AuthForm from '$blocks/components/ui/AuthForm.vue';
import Group from '$blocks/components/ui/inputs/Group.vue';
import { t } from '$core/utils/i18n';
import api from '$core/services/express-spa-api';
//    const auth = reactive({
//        email: 'vesaka_bgr@hotmail.com',
//    });

const auth = reactive({
    email: '',
});

const onSubmit = () => {
    return new Promise((done, fail) => {
        setTimeout(done, 2000);
    }).then(() => {
        console.log('SUBMITED');
    }).catch(() => {
        console.log('FAIL');
    });
    return api.post('api/forgot-password', auth);
};

</script>