import router from '$blocks/bootstrap/router';
import { useGameStore } from '$blocks/bootstrap/stores';
import { PLAY_PATH, LEVELS_PATH } from '$blocks/bootstrap/paths';

export const startLevel = (level = null) => {

    if(typeof level === 'number') {
        const store = useGameStore();
        store.level.current = level;
    }

    router.push(PLAY_PATH);
}

export const goToLevelsScreen = () => {
    router.push(LEVELS_PATH);
}