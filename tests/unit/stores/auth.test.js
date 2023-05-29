import { describe, it, mock, expect, beforeEach } from 'vitest';
import { useAuthStore } from '$blocks/bootstrap/stores';
import { setActivePinia, createPinia } from 'pinia'

import pinia from '$blocks/bootstrap/pinia';

describe('Auth Store ', () => {
    let authStore;
    const mockUser = {
        id: 1, 
        name: 'John Doe',
        token: 'MySecretToken',
        isGuest: false
    };

    setActivePinia(pinia);
    
    beforeEach(() => {
        authStore = useAuthStore();
        
    });

    it('saves logged in user', () => {
        authStore.login(mockUser);
        expect(authStore.loggedIn).toBe(true);
        expect(authStore.user.id).toBe(mockUser.id);
        expect(authStore.user.name).toBe(mockUser.name);
        expect(authStore.user.token).toBe(mockUser.token);
    });

    it('logs out user', () => {
        authStore.login(mockUser);

        authStore.logout();

        expect(authStore.user.id).not.toBe(mockUser.id);
        expect(authStore.user.name).not.toBe(mockUser.name);
        expect(authStore.user.token).not.toBe(mockUser.token);
        expect(authStore.loggedIn).toBe(false);
    });
});