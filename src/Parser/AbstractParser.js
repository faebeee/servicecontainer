'use strict';

let Definition = require('../Definition');

module.exports = class AbstractParser{
    /**
     *
     * @param {String} rootDir
     */
    constructor(rootDir) {
        this.rootDir = rootDir;
    }
    
    /**
     * Parse data
     * @param {object} data
     * @param {Container} container
     */
    parse(data, container) {
        if (data === null || data === undefined) {
            return;
        }
        this.loadParameters(data, container);
        this.loadImport(data, container);
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
     * @param {Object} serviceConf
     * @returns
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
     * @returns
     */
    loadParameters(data, container) {
        if (data.parameters === undefined || data.parameters === null) {
            return;
        }

        let parameters = data.parameters;
        let keys = Object.keys(parameters);
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let value = parameters[key];
            container._addParameter(key, value);
        }   
    }

    /**
     * 
     * @param {Object} data
     * @param {Container} container
     * @returns
     */
    loadImport(data, container) {
        throw new Error('Method not implemented');
    }
};