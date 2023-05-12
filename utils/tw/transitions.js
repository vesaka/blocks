import { raw, extend } from '$core/utils/object';
import { tw } from './index';
export const def = {
    enterActive: '',
    enterFrom: '',
    enterTo: '',
    leaveActive: '',
    leaveFrom: '',
    leaveTo: ''
}

const groups = [
    'enterActive', 'enterFrom', 'enterTo',
    'leaveActive', 'leaveFrom', 'leaveTo'
];

const tweens = {
    ease: {
        enterActive: 'duration-300 ease-out',
        enterFrom: 'transform opacity-0',
        enterTo: 'opacity-100',
        leaveActive: 'duration-200 ease-in',
        leaveFrom: 'opacity-100',
        leaveTo: 'transform opacity-0'
    },
    fade: {
        enterFrom: 'opacity-0',
        leaveTo: 'opacity-0',
        enterActive: 'transition duration-300',
        leaveActive: 'transition duration-300'
    },
    fadeIn: {
        enterFrom: 'opacity-0',
        enterActive: 'transition duration-300'
    },
    fadeOut: {
        leaveFrom: 'opacity-0',
        leaveActive: 'transition duration-300'
    },
    slideIn: {
        enterFrom: 'translate-x-[150%] opacity-0',
        enterActive: 'transition duration-300'
    },
    slideOut: {
        leaveTo: 'translate-x-[150%] opacity-0',
        leaveActive: 'transition duration-300'
    },
    slide: {
        enterFrom: 'translate-x-[150%] opacity-0',
        leaveTo: 'translate-x-[150%] opacity-0',
        enterActive: 'transition duration-300',
        leaveActive: 'transition duration-300'
    },


}

export const tween = (name, extra = {}) => {
    const transition = raw(tweens[name] || Object.values(tweens)[0]);

    const group = {};
    for (const key of groups) {
        group[key] = (transition[key] || '') + (extra[key] || '');
    }
    return group;
};

