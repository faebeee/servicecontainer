'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = require("./Container");
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
    create(file, parameters = {}) {
        if (!container) {
            container = new Container_1.default(file, parameters);
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
