<template>
    <AuthForm name="login-form"
              :submit="onSubmit"
              form-title="Login">
        <div class="form-group">
            <Group :placeholder="t('login.name.placeholder')" name="name" type="text" v-model="auth.name"></Group>
            <Group :placeholder="t('login.password.placeholder')" name="password" type="password" v-model="auth.password"></Group>
        </div>
        <template #footer>
            <TickCheckbox class="pt-4 mx-auto justify-center" v-model="auth.remember" :text="t('login.remember', 'Remember me')"/>
             <p class="pt-4"><RouterLink :class="merge('link', props.link)" :to="REGISTER" v-html="t('login.with-account', 'Have an Account? Click Here')"></RouterLink></p>
            <p class="pt-4"><RouterLink :class="merge('link', props.link)" :to="FORGOT_PASSWORD" v-html="t('login.forgot-password', 'Forgot your password?')"></RouterLink></p>
        </template>
    </AuthForm>
</template>
<script setup>
    import { reactive, watch  } from 'vue';
    import AuthForm from '$blocks/components/ui/AuthForm.vue';
    import Group from '$blocks/components/ui/inputs/Group.vue';
    import TickCheckbox from '$blocks/components/ui/inputs/TickCheckbox.vue';
    import api from '$core/services/express-spa-api.js';
    import { raw }from '$core/utils/object.js';

    import { t } from '$core/utils/i18n';
    import { asset, FORGOT_PASSWORD, BASE, PLAY, REGISTER } from '$blocks/bootstrap/paths';
    import { useAuthStore } from '$blocks/bootstrap/stores';
    import { useRouter } from 'vue-router';
    import { classProps, merge } from '$blocks/utils/class.util';
    const authStore = useAuthStore();
    
    const props = Object.assign(classProps, {
        
    });

//    const auth = reactive({
//        username: 'vesakabgr',
//        password: '12345678'
//    });
    
    const auth = reactive({
        name: 'admin',
        password: '!VesakaIsAdmin$',
        remember: false
    });
    
    const router = useRouter();

    const onSubmit = () => {
        
        return api.post('user/login', raw(auth))
                .then(({data}) => {
                    api.setBearer(data.token);
                    authStore.login(data);
                    router.push(PLAY);
                });
    };
</script>



