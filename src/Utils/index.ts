/**
 * Check if argument is a reference to a parameter
 * @param {string} arg
 * @returns Boolean
 */
export function isParameterReference(arg: string) {
    if (/%[^%]+%$/.test(arg)) {
        return true;
    } else {
        return false;
    }
}

/**
 * CHeck if argument starts with `@`
 * 
 * @param {string}arg 
 * @returns Boolean
 */
export function isServiceReference(arg: string){
    return arg.indexOf("@") === 0;
}

/**
 * Get reference name to a parameter
 * 
 * @param {string} arg 
 * @returns String
 */
export function getParameterReferenceName(arg: string) {
    return arg.replace(/%/g, '');
}

/**
 * Get name of service
 * 
 * @param {stirng} arg 
 * @requires String
 */
export function getServiceReference(arg :string){
     let stripped;
    stripped = arg.replace(/^@/, '');
    stripped = stripped.replace(/^\?/, '');
    return stripped;
}