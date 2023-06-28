import { it, expect, describe, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { t } from '$core/utils/i18n';
import NotFound from '$blocks/components/pages/NotFound.vue';

describe('page 404', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(NotFound);
    });

    it('shows 404 and page not found', () => {
        expect(wrapper.html()).toContain('404');
        expect(wrapper.html()).toContain(t('404.not-exist'));
    });
    
    it('has back button', () => {
        expect(wrapper
            .findAll('a')
            .find(btn => btn.text().match('/Back/'))
        ).not.toBe(null);
    });

});

describe('Visitor', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = mount(NotFound);
    });

    it('clicks back button and goes to Start page', async () => {
        const backBtn = wrapper
            .findAll('a')
            .find(btn => btn.text().match('/Back/'));
        await backBtn.trigger('click');
        expect(wrapper.html()).toContain('Home');
    })
})