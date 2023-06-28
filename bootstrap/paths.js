import env from './imports';

export const BASE =  env.DEV ? '/' : '/unblockme/';
export const SIGNUP_PATH = BASE + 'sign-up';
export const LOGIN_PATH = BASE + 'log-in';
export const PLAY_PATH = BASE + 'playground';
export const LEADERBOARD = BASE + 'leaderboard';
export const PAGE_404 = BASE + '404';
export const FORGOT_PASSWORD = BASE + 'forgot-password';
export const RESET_PASSWORD = BASE + 'reset-password';
export const LEVELS_PATH = BASE + 'levels';

