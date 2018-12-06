import Container from './Container';
declare const _default: {
    /**
     * Build a new container
     *
     * @param {String} file
     * @returns {Container}
     */
    create(file: string, parameters?: Object): Container;
    /**
     * Get created container
     *
     * @returns {Container}
     */
    get(): Container | null;
    /**
     * Destroy current container
     */
    destroy(): void;
};
/**
 * Construct a Builder object
 * @module
 */
export default _default;
