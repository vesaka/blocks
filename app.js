import { createApp } from 'vue'
import './style.css';
import '$lib/assets/css/room-transitions.css';
import '$lib/assets/css/push-button.css';

import App from './App.vue';
import pinia from './bootstrap/pinia';
import router from './bootstrap/router';
createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app');
