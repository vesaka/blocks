import { computed } from 'vue';
import { useAuthStore, useGameStore } from '$blocks/bootstrap/stores';



export const useGame = () => {
    const gameStore = useGameStore();
    const authStore = useAuthStore();

    const loggedIn = gameStore.loggedIn;
    const isGuest = !gameStore.loggedIn;


    return { gameStore, authStore, loggedIn, isGuest };
};


