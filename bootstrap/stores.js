import { defineStore } from 'pinia';
import api from '$core/services/wp-api.js';
import { raw, extend } from '$core/utils/object.js';
import { game } from '$blocks/config/options.json';

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

export const useGameStore = defineStore('game', {
    state: () => {
        return {
            score: 0,
            bestScore: 0,
            endScore: 0,
            state: 'ready',
            players: [],
            fullscreen: false,
            sound: true,
            level: raw(game.level),
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
        setState(state) {
            this.state = state;
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