'use strict';

import Container from './Container';
let container = null;

/**
 * Construct a Builder object
 * @module
 */
module.exports = {

    /**
     * Build a new container
     *
     * @param {String} file
     * @returns {Container}
     */
    create(file, parameters: Object = {} ): Container {
        if (!container) {
            container = new Container(file, parameters);
        }
        return container;
    },

    /**
     * Get created container
     *
     * @returns {Container}
     */
    get() {
        return container;
    },

    /**
     * Destroy current container
     */
    destroy() {
        container = null;
    }
};
