import { useGameStore } from '$blocks/bootstrap/stores';
import { describe, it, beforeEach, expect } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { 
    PLAYING, FINISHED, COMPETITION
} from '$blocks/bootstrap/constants';
import fixtures from '$blocks/tests/fixtures/levels.json';

let store;
setActivePinia(createPinia());
describe('Game Store ', () => {
    beforeEach(() => {
        store = useGameStore();
    });


    it('starts level', () => {       
        it.each(fixtures.startData)(`level %d has %d moves`, (level, moves) => {
            store.startLevel(level, moves);
            expect(store.level.current, 'Current level is not correct').toBe(level);
            expect(store.level.moves, 'Not same number of moves').toBe(moves);
            expect(store.level.start, 'Start time should be now').toBeCloseTo(new Date().getTime() / 1000);
            expect(store.state, 'Game is not in PLAYING state').toBe(PLAYING);
        });
    });

    it('ends level', () => {
        it.each(fixtures.endData)(`level %d was saved with `, (level, moves) => {
            store.endLevel({ current: level, moves });
            expect(store.level.current, 'Current level is not correct').toBe(level);
            expect(store.level.moves, 'Not same number of moves').toBe(moves);
            expect(store.state, 'Game is not in FINISHED state').toBe(FINISHED);
        });
    });

    it('updates mode', () => {
        store.updateMode(COMPETITION);
        expect(store.mode, 'Game is not in PLAYING state').toBe(COMPETITION);

    });

    it('prevents mode update', () => {
        store.updateMode(PLAYING);
        expect(store.mode, 'Game is not in PLAYING state').not.toBe(PLAYING);
    });
    
});
