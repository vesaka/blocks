import { isObject, extend } from '$core/utils/object';
export const tw = (list, classList = {}) => {
    if (typeof classList === 'string') {
        list[classList] = true;
    } else if (isObject(classList)) {
        return extend(list, classList);
    }

    return list;
};


