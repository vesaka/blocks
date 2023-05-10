import Login from '$blocks/components/pages/auth/Login.vue';
import SignUp from '$blocks/components/pages/auth/SignUp.vue';
import ForgotPassword from '$blocks/components/pages/auth/ForgotPassword.vue';
import ResetPassword from '$blocks/components/pages/auth/ResetPassword.vue';
const Playground = () => import('$blocks/components/pages/Playground.vue');
import Leaderboard from '$blocks/components/pages/Leaderboard.vue';
import Start from '$blocks/components/pages/Start.vue';
import NotFound from '$blocks/components/pages/NotFound.vue';

import {
    BASE, LOGIN_PATH, PLAY_PATH, PAGE_404, SIGNUP_PATH,
    LEADERBOARD, FORGOT_PASSWORD, RESET_PASSWORD,
} from './paths.js';

const routes = [
    {
        path: BASE,
        name: 'home',
        component: Start,
        meta: {
            title: 'Welcome',
            transitionName: 'slide-left',
        }
    },
    {
        path: LOGIN_PATH,
        name: 'login',
        component: Login,
        meta: {
            title: 'Log in',
            shouldBeLoggedIn: false,
            transitionName: 'jump',
        }
    },
    {
        path: SIGNUP_PATH,
        name: 'sign-up',
        component: SignUp,
        meta: {
            title: 'Sign up',
            transitionName: 'jump',
        }
    },
    {
        path: FORGOT_PASSWORD,
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
            title: 'Forgot password',
            transitionName: 'jump',
        }
    },
    {
        path: RESET_PASSWORD,
        name: 'reset-password',
        component: ResetPassword,
        meta: {
            title: 'Reset',
            transitionName: 'jump',
        }
    },
    {
        path: PLAY_PATH,
        name: 'playground',
        component: Playground,
        meta: {
            title: 'Playground'
        }
    },
    {
        path: LEADERBOARD,
        name: 'leaderboard',
        component: Leaderboard,
        meta: {
            title: 'Leaderboard'
        }
    },
    {
        path: PAGE_404,
        name: 'not-found',
        component: NotFound,
        meta: {
            title: '404',
            transitonName: 'scale-up',
        }
    },
];

export default routes;