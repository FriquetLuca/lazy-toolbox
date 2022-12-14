export const getType = (parameter: any): string => {
    if(typeof parameter === 'function' && /^\s*class\s+/.test(parameter.toString())) {
        return 'class';
    }
    if(Array.isArray(parameter)) {
        return 'array';
    }
    return typeof parameter;
};