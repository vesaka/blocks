import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Start from '$blocks/components/pages/Start.vue';
import pinia from '$blocks/bootstrap/pinia';
import router from '$blocks/bootstrap/router';
import { PLAY_PATH, LEVELS_PATH, LOGIN_PATH } from '$blocks/bootstrap/paths';

const mountOptions = {
    global: {
        plugins: [router, pinia]
    }
};
let wrapper;

const createWrapper = (options = {}) => {
    return mount(Start, Object.assign({
        global: {
            plugins: [router, pinia]
        }
    }, options));
};
describe('Any visitor ', () => {

    beforeEach(() => {
        wrapper = mount(Start, mountOptions);
    });


    it('goes to Start page and sees Home', () => {
        expect(wrapper.html()).toContain('Home');
    });

})

describe('Guest ', () => {
    beforeEach(() => {
        wrapper = mount(Start, mountOptions);
    });
    it('sees login button', () => {
        expect(wrapper
            .findAll('a')
            .find(btn => btn.text().match('/Login/'))
        ).not.toBe(null);
    });

    it('sees Play button', () => {
        expect(wrapper
            .findAll('a')
            .find(btn => btn.text().match('/Play/'))
        ).not.toBe(null);
    });
});

describe('User ', () => {
    let push;
    beforeEach(() => {

        const auth = {
            loggedIn: true
        };

        wrapper = createWrapper({
            global: {
                plugins: [router, pinia],
                mocks: { auth }
            }
        });

        push = vi.spyOn(router, 'push');
    });

    it('does not see login button', () => {
        expect(wrapper.find(`[href="${LOGIN_PATH}"]`).exists()).toBe(false);
    });

});

describe('Any User ', () => {
    let push;

    const auth = {
        loggedIn: false
    };

    beforeEach(async () => {
        wrapper = createWrapper({
            global: {
                plugins: [router, pinia],
                mocks: { auth }
            }
        });

        router.push('/');
        await router.isReady();

        push = vi.spyOn(router, 'push');
    });

    const test_navigate = path => {
        wrapper.find(`[href="${path}"]`).trigger('click');
        expect(push).toHaveBeenCalledTimes(1);
        expect(push).toHaveBeenCalledWith(path);
    }

    it('navigates to playground page',  () => {
        test_navigate(PLAY_PATH);
    });

    it('navigates to levels page', async () => {
        test_navigate(LEVELS_PATH);
    });

    it.runIf(!auth.loggedIn)('navigates to login page', async () => {
        test_navigate(LOGIN_PATH);
    });
});