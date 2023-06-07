import { describe, it, expect, beforeEach, vi } from 'vitest';
import { t } from '$blocks/tests/utils/i18n.util';
import { mount } from '@vue/test-utils';
import Leaderboard from '$blocks/components/pages/Leaderboard.vue';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '$blocks/bootstrap/stores';
import pinia from '$blocks/bootstrap/pinia';
import fixtures from '$blocks/tests/fixtures/leaderboard.json';

let store;
const createWrapper = (data = []) => {
    setActivePinia(pinia);
    store = useGameStore();
    store.players = data;
    return mount(Leaderboard, {
        global: {
            plugins: [pinia]
        }
    });
};
describe('User', () => {
    let wrapper;

    it('goes to Leaderboard page and sees the title', () => {
        wrapper = createWrapper();
        expect(wrapper.html()).toContain(t('leaderoard.title'));
    });

    it('sees no results message', () => {
        wrapper = createWrapper();
        expect(wrapper.html()).toContain(t('leaderboard.empty'))
    });

    it('can see top scores', () => {
        wrapper = createWrapper(fixtures.results);
        setTimeout(() => {
            expect(wrapper.html(), 'No results found').not.toContain(t('leaderboard.empty'));
        }, 300);
    })
});