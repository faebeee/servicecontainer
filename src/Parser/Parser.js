'use strict';

let Definition = require('../Definition');

module.exports = class Parser{
    constructor() {
        
    }

    /**
     * 
     * 
     * @param {any} data
     * @param {any} container
     */
    parse(data, container, rootDir) {
        this.loadImport(data, container);
        this.loadParameters(data, container);
        this.loadServices(data, container, rootDir);
    }

    /**
     * 
     */
    loadServices(data, container, rootDir) {
        if (data.services === undefined || data.services === null) {
            return;
        }    

        let services = data.services;
        let keys = Object.keys(services);
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let value = services[key];
            
            container.addDefinition(key,
                this.createServiceDefinition(value, rootDir)
            );
        }           

    }

    /**
     * 
     * 
     * @param {object} serviceConf
     * @param {string} rootDir
     * @returns
     */
    createServiceDefinition( serviceConf, rootDir ) {
        let def = new Definition();
        
        def.file = serviceConf.file || null;
        def.className = serviceConf.className || null;
        def.arguments = serviceConf.arguments || [];
        def.rootDir = rootDir;
        def.isClass = serviceConf.isClass || false;
        def.isObject = serviceConf.isObject || false;
        def.calls = serviceConf.calls || [];
        def.properties = serviceConf.properties || [];

        return def;
    }

    /**
     * 
     * 
     * @param {any} data
     * @param {any} container
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
            container.addParameter(key, value);
        }   
    }

    /**
     * 
     * @todo
     * @param {any} data
     * @param {any} container
     * @returns
     */
    loadImport(data, container) {
        if (data.imports === undefined || data.imports === null) {
            return;
        }    

        let imports = data.imports;
        let keys = Object.keys(imports);
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let value = imports[key];
            this.parse(require(value), container)
        }   
    }
}