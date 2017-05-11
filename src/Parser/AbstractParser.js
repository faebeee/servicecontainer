'use strict';

let Definition = require('../Definition');
let Path = require('path');

/**
 * @class
 */
class AbstractParser{

    /**
     *
     */
    constructor(servicesConfiguration) {
        this.servicesConfiguration = servicesConfiguration;
        this.configDir = Path.dirname(servicesConfiguration);
    }

    /**
     * Parse data
     * @param {Object} data
     * @param {Container} container
     * @param {String} folder
     */
    parse(data, container, folder) {
        if (data === null || data === undefined) {
            return;
        }
        folder = folder || this.configDir;

        this.loadImport(data, container, folder);
        this.loadParameters(data, container);
        this.loadServices(data, container, folder);
    }


    /**
     *
     * @param {Object} data
     * @param {Container} container
     */
    loadServices(data, container, folder) {
        if ((data.services === undefined || data.services === null) || data.services.length <= 0) {
            return;
        }

        let services = data.services;
        let keys = Object.keys(services);
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let value = services[key];

            if ((value.file === undefined || value.file === null) || value.file.length <= 0) {
                throw new Error('For for '+key+' missing!');
            }

            value.file = Path.resolve(folder, value.file);
            
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
    createServiceDefinition( name, serviceConf ) {
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
    loadImport(data, container, folder) {
        if (data.imports === undefined || data.imports === null) {
            return;
        }


        let imports = data.imports;
        let keys = Object.keys(imports);
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let value = imports[key];
            let importFile = Path.resolve(folder, value);

            //let importFile = this.rootDir + value.replace('./', '/');
            this.parse(require( importFile ), container, Path.dirname(importFile))
        }
    }
}

module.exports = AbstractParser;