import { nextTick } from 'vue';
import { createRouter, createWebHistory  } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from './stores';
import { BASE, PAGE_404, LOGIN_PATH } from './paths';
import routes from './routes';
import { t } from '$core/utils/i18n';

const router = createRouter({
    history: createWebHistory(),
    mode: 'history',
    routes: routes
});

router.beforeEach((to, from) => {
    if (PAGE_404 === to.path) {
        return;
    }

    if (!to.name) {
         router.push(PAGE_404);  
         return;
    }
    
    const { loggedIn } = storeToRefs(useAuthStore());
    if ((false === to.meta.needsAuth) && loggedIn.value) {
        router.push(BASE);
    } else if ((true === to.meta.needsAuth) && !loggedIn.value) {
        router.push(LOGIN_PATH);
    } 

});

router.afterEach((to, from) => {
    document.body.classList.remove(from.name);
    document.body.classList.add(to.name);
    
    if (from.meta.className) {
        document.body.classList.remove(from.meta.className);
    }
    
    if (to.meta.className) {
        document.body.classList.add(to.meta.className);
    }
    
    nextTick(() => {
        
        if (to.meta.title) {
            document.title = `${to.meta.title} | ${t('title')}`;
        } else {
            document.title = t('title');
        }

    });
});

export { routes };
export default router;