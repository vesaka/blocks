import { app } from '$blocks/config/settings';
import env from './imports';

console.log('env', app);
export const BASE =  '/' + (env.PROD ? env.VITE_GAME_KEY + '/'  : '');
export const SIGNUP_PATH = '/sign-up';
export const LOGIN_PATH = '/log-in';
export const PLAY_PATH = '/playground';
export const LEADERBOARD = '/leaderboard';
export const PAGE_404 = '/404';
export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';
export const LEVELS_PATH = '/levels';
export const SUCCESS_PATH = '/sucess';
export const COMPLETED = '/completed';

export const svg = path => {
    return `/assets/svg/${path}.svg`;
};

export const asset = path => {
    return `/assets/${path}`;
};

export const bg = path => {
    return `/assets/bg/${path}`;
};

export const btn = path => {
    return `/assets/btn/${path}.png`;
};

export const img = path => {
    return `/assets/img/${path}.png`;
};