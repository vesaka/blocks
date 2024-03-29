import { defineStore } from 'pinia';
import { raw, extend, isObject } from '$core/utils/object.js';

import { 
    FREE_PLAY, COMPETITION, LOADING,
     READY, PLAYING, FINISHED 
} from './constants.js'


export const gameStates = [LOADING, READY, PLAYING, FINISHED];
export const modes = ['free', 'competition'];
export const useAuthStore = defineStore('$auth$', {
    state: () => ({
        user: {
            id: '',
            name: '',
            token: '',
            isGuest: true
        }
    }),
    actions: {
        login(user) {
            for (let key in this.user) {
                if (user.hasOwnProperty(key)) {
                    this.user[key] = user[key];
                }
            }            
        },
        async logout() {
            this.$reset();
        }
    },
    getters: {
        loggedIn: (state) => {
            return !!state.user.token && !state.user.isGuest;
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['user']
            }
        ]
    }
});

const initialLevel = {
    current: 1,
    start: '',
    end: '',
    stars: 1,
    secret: '',
    moves: 0,
    optimalMoves: 0,
    events: []
};

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            state: LOADING,
            mode: FREE_PLAY,
            players: null,
            fullscreen: false,
            sound: true,
            level: raw(initialLevel),
            levels: []
        };
    },
    actions: {
        updateMode(mode) {
            if ([FREE_PLAY, COMPETITION].includes(mode)) {
                this.mode = mode;
            }
        },
        startLevel(level, bestMoves) {
            this.state = PLAYING;
            this.level = extend(initialLevel, {
                current: level,
                optimalMoves: bestMoves,
                start: Math.round(new Date().getTime() / 1000)
            });
        },
        endLevel(data = {}) {
            this.level = extend(this.level, data);
            let lvl = this.levels.find(lvl => {
                return lvl.current === this.level.current;
            })

            const levelToSave = raw(this.level);
            if (lvl) {
                if (0 < lvl.moves) {
                    levelToSave.moves = Math.min(lvl.moves, levelToSave.moves);
                }
                Object.assign(lvl, levelToSave);
            } else {
                lvl = raw(this.level);
                this.levels.push(lvl);
            }

            this.state = FINISHED;
            return lvl;
        }
    },
    getters: {
        levelOptions({ level: { moves, current } }) {
            return {
                moves: moves.optimal + current * moves.byLevel,
            };
        },
        gameIs(state) {
            return (status) => {
                return state.state === status;
            };
        },
        myLevels(state) {
            return state.levels.sort((a, b) => {
                return a.current - b.current;
            });
        }
    },
    persist: {
        enabled: true,
        startegies: [
            {
                key: 'game',
                storage: localStorage,
                paths: ['mode', 'players', 'sound', 'level', 'levels']
            }
        ]
    }
});

export const useErrorStore = defineStore('$errors$', {
    state: () => ({
        errors: {
            
        }
    }),
    actions: {
        update(newErrors) {
            this.errors = newErrors;
        },
        clear(name) {
            if (typeof name === 'string') {
                this.errors[name] = '';
            } else {
                this.errors = {};
            }
        }
    },
    getters: {
        first(state) {
            return name => { 
                const err = state.errors[name] || '';
                if (isObject(err)) {
                    const firstError = raw(err[Object.keys(err)[0]]);
                    return aprintf(t(`messages.${firstError.message}`, firstError.message), firstError);
                } else if (Array.isArray(err)) {
                    return err[0];
                }
                
                return err;
            };
        },
        collect(state) {
            return name => state.errors[name] || [];
        }
    }
});