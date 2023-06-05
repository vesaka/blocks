<template>
    <div>        
        <Transition :enter-active-class="fade.enterActive"
             :enter-from-class="fade.enterFrom"
             :enter-to-class="fade.enterTo"
             :leave-active-class="fade.leaveActive"
             :leave-from-class="fade.leaveFrom"
             :leave-to-class="fade.leaveTo">
            <div :class="dimmer" v-if="isOpen" @click="closeDrawer()"></div>
        </Transition>
        <Transition :enter-active-class="left.enterActive"
             :enter-from-class="left.enterFrom"
             :enter-to-class="left.enterTo"
             :leave-active-class="left.leaveActive"
             :leave-from-class="left.leaveFrom"
             :leave-to-class="left.leaveTo">
            <div v-if="isOpen" :class="drawerRoot" tabindex="-1" aria-labelledby="drawer-navigation-label">
                <h5 id="drawer-navigation-label" :class="drawerLabel">
                    <slot name="title">Menu</slot>
                </h5>
                <button type="button" @click="closeDrawer()"
                    :class="drawerCloseButton"
                    aria-controls="drawer-navigation">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                    <span class="sr-only">Close menu</span>
                </button>
                <div class="py-4 overflow-y-auto">
                    <slot>Content</slot>
                </div>
                
            </div>
        </Transition>

    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import { drawerRoot, drawerLabel, dimmer, drawerCloseButton } from '$blocks/utils/tw/drawer.tw';
import { tween } from '$blocks/utils/tw/transitions';

const swipeDisabled = ref(false);
const isOpen = ref(false);
const startX = ref(null);

const fade = computed(() => tween('fade'));
const left = computed(() => tween('drawerLeft'));

const openDrawer = () => {
    if (!swipeDisabled.value) {
        isOpen.value = true;
    }
};

const onRouteChange = (to) => {
    swipeDisabled.value = !!to.meta.disableSwiping;
    if (isOpen.value && swipeDisabled.value) {
        closeDrawer();
    }

    if (swipeDisabled.value) {
        disableSwipeEvents();
    } else {
        enableSwipeEvents()
    }
}

const closeDrawer = () => {
    isOpen.value = false;
};

const onTouchStart = (ev) => {
    startX.value = ev.touches[0].clientX;
}

const onMouseDown = (ev) => {
    startX.value = ev.clientX;
};

const onTouchEnd = (ev) => {
    onInteractionEnd(ev.changedTouches[0].clientX);
};

const onMouseUp = (ev) => {
    onInteractionEnd(ev.clientX);
};

const onInteractionEnd = endX => {
    const deltaX = endX - startX.value;
    if (deltaX > 50) {
        openDrawer()
    }
    startX.value = null;
};

const enableSwipeEvents = () => {
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('mouseup', onMouseUp);
}

const disableSwipeEvents = () => {
    document.removeEventListener('touchstart', onTouchStart);
    document.removeEventListener('mousedown', onMouseDown);
    document.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('mousedown', onMouseUp);
}

const route = useRoute();
watch(route, onRouteChange);
onRouteChange(route);

onBeforeUnmount(disableSwipeEvents);
</script>