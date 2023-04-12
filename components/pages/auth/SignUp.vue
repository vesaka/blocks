<template>
    <AuthForm
        form-title="Sign UP"
        :submit="onSubmit">
        <Group name="name" :placeholder="t('register.username.placeholder', 'Enter your username')"  v-model="auth.name"/>
        <Group name="email" type="email" placeholder="youremail@email.com"  v-model="auth.email"/>
        <Group name="password" type="password" :placeholder="t('register.password.placeholder', 'Create a password')"  v-model="auth.password"/>
        <Group name="password_confirmation" type="password" :placeholder="t('register.confirm-password.placeholder', 'Create a password')"  v-model="auth.password_confirmation"/>
        <Group name="accept">
            <template #input>
                <TickCheckbox class="pt-4 mx-auto justify-center" v-model="auth.accept" id="accept-terms">
                    <template #view>
                        <span v-html="t('register.accept', 'Accept terms and conditions')"></span>
                    </template>
                </TickCheckbox>
            </template>
        </Group>


        <template #footer>
            <p class="py-4">
                <span class="mr-1" v-html="t('register.continue', 'Continue as a')"></span>
            <RouterLink class="mr-1" :to="PLAY" v-html="t('register.guest', 'guest ')"></RouterLink>
            <span class="mr-1" v-html="t('register.or', 'or ')"></span>
            <RouterLink class="mr-1" :to="LOGIN" v-html="t('register.login', 'login ')"></RouterLink>
            </p>
        </template>
        <template #redirect>
            <p class="text-center" v-html="t('register.check-email', 'Please check you email to confirm your registration')"></p>
        </template>
    </AuthForm>
</template>
<script setup>
    import { reactive, ref, computed, watch } from 'vue';
    import AuthForm from '$blocks/components/ui/AuthForm.vue';
    import Group from '$blocks/components/ui/inputs/Group.vue';
    import TickCheckbox from '$blocks/components/ui/inputs/TickCheckbox.vue';
    import api from '$core/services/express-spa-api.js';
    import { useRouter } from 'vue-router';
    import { svg, PLAY, LOGIN } from '$blocks/bootstrap/paths.js'
    import { t } from '$core/utils/i18n';

    import { useErrorStore } from '$blocks/bootstrap/stores';
    const errors = useErrorStore();



//    const auth = reactive({
//        name: 'vesakahotmail',
//        email: 'vesaka_bgr@hotmail.com',
//        password: '12345678',
//        password_confirmation: '12345678',
//        accept: ''
//    });

    const auth = reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        accept: false
    });

    watch(() => auth.accept, (c) => {
        errors.clear('accept');
    })

    const onSubmit = () => {
//        return new Promise((done, fail) => {
//            setTimeout(done, 2000);
//        }).then(() => {
//            console.log('SUBMITED');
//        }).catch(() => {
//            console.log('FAIL');
//        });
        return api.post('user/register', auth);
    };

</script>
