/**
 * Check if argument is a reference to a parameter
 * @param {string} arg
 * @returns Boolean
 */
export declare function isParameterReference(arg: string): Boolean;
/**
 * CHeck if argument starts with `@`
 *
 * @param {string}arg
 * @returns Boolean
 */
export declare function isServiceReference(arg: string): Boolean;
/**
 * Get reference name to a parameter
 *
 * @param {string} arg
 * @returns String
 */
export declare function getParameterReferenceName(arg: string): string;
/**
 * Get name of service
 *
 * @param {stirng} arg
 * @requires String
 */
export declare function getServiceReference(arg: string): string;
