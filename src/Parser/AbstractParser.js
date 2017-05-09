'use strict';

let Definition = require('../Definition');

/**
 * @class
 */
class AbstractParser{
    /**
     *
     * @param {String} rootDir
     */
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    
    /**
     * Parse data
     * @param {Object} data
     * @param {Container} container
     */
    parse(data, container) {
        if (data === null || data === undefined) {
            return;
        }

        this.loadImport(data, container);
        this.loadParameters(data, container);
        this.loadServices(data, container);
    }


    /**
     *
     * @param {Object} data
     * @param {Container} container
     */
    loadServices(data, container) {
        if (data.services === undefined || data.services === null) {
            return;
        }    

        let services = data.services;
        let keys = Object.keys(services);
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let value = services[key];
            
            container._addDefinition(key,
                this.createServiceDefinition(key, value)
            );
        }           
    }

    /**
     * Create service definition
     * 
     * @param {String} name
     * @param {Object} serviceConf
     * @returns {Definition}
     */
    createServiceDefinition(name, serviceConf ) {
        let def = new Definition();
        
        def.name = name;
        def.file = serviceConf.file || null;
        def.arguments = serviceConf.arguments || [];
        def.isObject = serviceConf.isObject || false;
        def.tags = serviceConf.tags || [];

        return def;
    }

    /**
     * Load parameters from file
     * 
     * @param {Object} data
     * @param {Container} container
     */
    loadParameters(data, container) {
        if (data.parameters === undefined || data.parameters === null) {
            return;
        }

        let parameters = data.parameters;
        container._addParameters(parameters);
    }

    /**
     * 
     * @param {Object} data
     * @param {Container} container
     */
    loadImport(data, container) {
        throw new Error('Method not implemented');
    }
}

module.exports = AbstractParser;