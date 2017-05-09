'use strict';

let Container = require('./src/Container');

/**
 * Construct a Builder object
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