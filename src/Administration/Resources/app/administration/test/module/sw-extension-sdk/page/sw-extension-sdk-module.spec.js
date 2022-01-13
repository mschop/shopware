import { createLocalVue, shallowMount } from '@vue/test-utils';
import 'src/module/sw-extension-sdk/page/sw-extension-sdk-module';

const menuItem = {
    label: 'jest',
    locationId: 'jest',
    displaySearchBar: true,
    parent: 'sw-extension',
    baseUrl: 'http://example.com',
};

function createWrapper() {
    const localVue = createLocalVue();

    return shallowMount(Shopware.Component.build('sw-extension-sdk-module'), {
        localVue,
        propsData: {
            id: Shopware.Utils.format.md5(JSON.stringify(menuItem)),
        },
        stubs: {
            'sw-page': true,
            'sw-loader': true,
            'sw-my-apps-error-page': true,
            'sw-iframe-renderer': true,
        },
    });
}

jest.setTimeout(8000);

describe('src/module/sw-extension-sdk/page/sw-extension-sdk-module', () => {
    /** @type Wrapper */
    let wrapper;

    beforeEach(async () => {
        wrapper = await createWrapper();
    });

    afterEach(async () => {
        if (wrapper) await wrapper.destroy();
    });

    it('should be a Vue.JS component', () => {
        expect(wrapper.vm).toBeTruthy();
    });

    it('@slow should time out without menu item after 7000ms', async () => {
        await new Promise((r) => setTimeout(r, 7100));
        expect(wrapper.vm.timedOut).toBe(true);
    });

    it('@slow should not time out with menu item', async () => {
        Shopware.State.commit('menuItem/addMenuItem', menuItem);

        await new Promise((r) => setTimeout(r, 7100));
        expect(wrapper.vm.timedOut).toBe(false);
    });
});
