import Login from '$blocks/components/pages/auth/Login.vue';
import SignUp from '$blocks/components/pages/auth/SignUp.vue';
import ForgotPassword from '$blocks/components/pages/auth/ForgotPassword.vue';
import ResetPassword from '$blocks/components/pages/auth/ResetPassword.vue';
import Playground from '$blocks/components/pages/Playground.vue';
import Leaderboard from '$blocks/components/pages/Leaderboard.vue';
import Start from '$blocks/components/pages/Start.vue';
import NotFound from '$blocks/components/pages/NotFound.vue';
import Levels from '$blocks/components/pages/Levels.vue';

import {FREE_PLAY, COMPETITION} from '$blocks/bootstrap/constants';

import {
    BASE, LOGIN_PATH, PLAY_PATH, PAGE_404, SIGNUP_PATH,
    LEADERBOARD, FORGOT_PASSWORD, RESET_PASSWORD, LEVELS_PATH, SUCCESS_PATH
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
            needsAuth: false,
            transitionName: 'jump',
        }
    },
    {
        path: SIGNUP_PATH,
        name: 'sign-up',
        component: SignUp,
        meta: {
            title: 'Sign up',
            needsAuth: false,
            transitionName: 'jump',
        }
    },
    {
        path: FORGOT_PASSWORD,
        name: 'forgot-password',
        component: ForgotPassword,
        meta: {
            title: 'Forgot password',
            needsAuth: false,
            transitionName: 'jump',
        }
    },
    {
        path: RESET_PASSWORD,
        name: 'reset-password',
        component: ResetPassword,
        meta: {
            title: 'Reset',
            needsAuth: false,
            transitionName: 'jump',
        }
    },
    {
        path: PLAY_PATH,
        name: 'playground',
        component: Playground,
        meta: {
            title: 'Playground',
            redirects: {
                [FREE_PLAY]: LEVELS_PATH,
                [COMPETITION]: SUCCESS_PATH
            }
        }
    },
    {
        path: LEVELS_PATH,
        name: 'levels',
        component: Levels,
        meta: {
            title: 'Levels'
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