import { app } from '$blocks/config/settings';
export const BASE = '/';
export const SIGNUP_PATH = '/sign-up';
export const LOGIN_PATH = '/log-in';
export const PLAY_PATH = '/playground';
export const LEADERBOARD = '/leaderboard';
export const PAGE_404 = '/404';
export const BLOCKS_MANAGER = '/blocks-manager';

let START = app.url === window.location.host ? window.location.origin + app.theme : '';
export const svg = path => {
    return `${START}/assets/svg/${path}.svg`;
};

export const asset = path => {
    return `${START}/assets/${path}`;
};

export const bg = path => {
    return `${START}/assets/bg/${path}`;
};

export const btn = path => {
    return `${START}/assets/btn/${path}.png`;
};

export const img = path => {
    return `${START}/assets/img/${path}.png`;
};