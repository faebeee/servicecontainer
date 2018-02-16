"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check if argument is a reference to a parameter
 * @param {string} arg
 * @returns {Boolean}
 */
function isParameterReference(arg) {
    if (/%[^%]+%$/.test(arg)) {
        return true;
    }
    else {
        return false;
    }
}
exports.isParameterReference = isParameterReference;
/**
 * CHeck if argument starts with `@`
 *
 * @param {string}arg
 * @returns {Boolean}
 */
function isServiceReference(arg) {
    return arg.indexOf("@") === 0;
}
exports.isServiceReference = isServiceReference;
/**
 * Get reference name to a parameter
 *
 * @param {string} arg
 * @returns {string}
 */
function getParameterReferenceName(arg) {
    return arg.replace(/%/g, '');
}
exports.getParameterReferenceName = getParameterReferenceName;
/**
 * Get name of service
 *
 * @param {stirng} arg
 * @requires {string}
 */
function getServiceReference(arg) {
    let stripped;
    stripped = arg.replace(/^@/, '');
    stripped = stripped.replace(/^\?/, '');
    return stripped;
}
exports.getServiceReference = getServiceReference;
//# sourceMappingURL=index.js.map