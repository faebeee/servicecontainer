'use strict';

let Container = require('./Container');

/**
 * Construct a Builder object
 * @module
 */
module.exports = {

    /**
     *
     * @param {String} file
     * @returns {Container}
     */
    create(file) {
        return new Container( file );
    }
};