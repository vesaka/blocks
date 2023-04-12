<template>
    <AuthForm
        name="login-form"
        title-image="forgot-password-1.png"
        :submit="onSubmit"
        :auth="auth">
        <div class="form-group">
            <input type="email" :placeholder="t('forgot-password.email')" v-model="auth.email">
        </div>
        <template #footer>
            <p><RouterLink class="reg-play-link" :to="LOGIN_PATH" v-html="t('forgot-password.login', 'Login')"></RouterLink></p>
        </template>
        <template #redirect>
            <h2 class="text-center" v-html="t('forgot-password.onSucess')"></h2>
            <p><RouterLink class="reg-play-link" :to="LOGIN_PATH" v-html="t('forgot-password.login', 'Login')"></RouterLink></p>
        </template>
    </AuthForm>
</template>
<script setup>

    import { reactive } from 'vue';
    import { LOGIN_PATH } from '$blocks/bootstrap/paths.js'
    import AuthForm from '$blocks/components/ui/AuthForm.vue';
    import { t } from '$core/utils/i18n';
    import api from '$core/services/express-spa-api';
//    const auth = reactive({
//        email: 'vesaka_bgr@hotmail.com',
//        recycling: true
//    });
    
    const auth = reactive({
        email: '',
        recycling: true
    });

    const onSubmit = () => {
//        return new Promise((done, fail) => {
//            setTimeout(done, 2000);
//        }).then(() => {
//            console.log('SUBMITED');
//        }).catch(() => {
//            console.log('FAIL');
//        });
        return api.post('forgot-password', auth);
    };

</script>