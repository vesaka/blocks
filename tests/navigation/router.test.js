import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Start from '../../components/pages/Start.vue';
import { setActivePinia, createPinia, createTestingPinia } from 'pinia';
import pinia from '$blocks/bootstrap/pinia';
import router from '$blocks/bootstrap/router';



const mountOptions = {
    global: {
        plugins: [router, pinia]
    }
};
let wrapper;
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
            .findAll('button')
            .find(btn => btn.text().match('/Login/'))
        ).not.toBe(null);
    });

    it('sees Play as guest button', () => {
        expect(wrapper
            .findAll('button')
            .find(btn => btn.text().match('/Play as guest/'))
        ).not.toBe(null);
    });
});

// describe('User ', () => {
//     beforeEach(() => {
//         wrapper = mount(Start, mountOptions);
//     });

    
// })