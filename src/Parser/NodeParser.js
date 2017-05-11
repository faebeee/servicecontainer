'use strict';

let Definition = require('../Definition');
let AbstractParser = require('./AbstractParser');

/**
 * @class
 */
class NodeParser extends AbstractParser{
    /**
     *
     * @param {String} servicesConfiguration
     */
    constructor(servicesConfiguration) {
        super(servicesConfiguration);
    }

}

module.exports = NodeParser;