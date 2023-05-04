import { defineStore } from 'pinia';
import api from '$core/services/wp-api.js';
import { raw, extend } from '$core/utils/object.js';
import { game } from '$blocks/config/options.json';

export const LOADING = 'loading';
export const READY = 'ready';
export const PLAYING = 'playing';
export const FINISHED = 'finished';

export const gameStates = [LOADING, READY, PLAYING, FINISHED];

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
            //this.user = user;
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
        
    }
});

const initialLevel = {
    current: 1,
    start: '',
    end: '',
    score: '',
    secret: '',
    events: []
};

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            score: 0,
            bestScore: 0,
            state: LOADING,
            players: [],
            fullscreen: false,
            sound: true,
            level: initialLevel,
            levels: [],
            log: {
                start: '',
                end: '',
                score: '',
                secret: '',
                entries: []
            }
        };
    },
    actions: {
        updateTime(delta) {
            const { current, max, min } = this.time;
            if(this.time.current >= this.time.min) {
                this.time.current -= delta;
                if (this.time.current < this.time.min) {
                    this.time.current = this.time.min;
                }
            }
        },
        updateScore(score) {
            this.score = Math.max(this.score + score, 0);
        },
        updateBestScore() {
            
        },
        resetAll() {            
            const score = this.score;
        },
        resetLevel() {
            const { current, moves } = this.state.level;
            this.state.level = extend(this.state.level, {
                current, moves
            });
        },
        startLevel(level, moves) {
            this.state.level = extend(this.state.level, {
                current: level, moves
            });
        },
        setState(state) {
            this.state = state;
        },
        addEntry(entry) {
            this.state.log.entries.push(entry);
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
        }
    },
    persist: {
        enabled: false,
    }
});