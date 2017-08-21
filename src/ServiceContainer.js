'use strict';

const Container = require('./Container');
let container = null;

/**
 * Construct a Builder object
 * @module
 */
module.exports = {

    /**
     * Build a new container
     * @param {String} file
     * @returns {Container}
     */
    create(file) {
        if (!container) {
            container = new Container(file);;
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
    }
};