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
        if (data.services === undefined) {
            throw 'No services configured';
        }

        this.loadImport(data, container, rootDir);
        this.loadParameters(data, container);
        this.loadServices(data, container, rootDir);
    }


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

    createServiceDefinition( serviceConf, rootDir ) {
        let def = new Definition();
        
        def.file = serviceConf.file;
        def.arguments = serviceConf.arguments || [];
        def.rootDir = rootDir;
        def.isClass = serviceConf.isClass;
        def.isObject = serviceConf.isObject;
        def.calls = serviceConf.calls;
        def.properties = serviceConf.properties;
        def.constructorMethod = serviceConf.constructorMethod;

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
    loadImport(data, container, rootDir) {
        if (data.imports === undefined || data.imports === null) {
            return;
        }    


        console.log(rootDir);

        let imports = data.imports;
        let keys = Object.keys(imports);
        for (let i = 0; i < keys.length; i++){
            let key = keys[i];
            let filePath = imports[key];

             filePath = filePath.replace(/^\.\.\//, './../');
            if (/^\.\//.test(filePath)) {
                // Remove references to the root dir
                filePath = rootDir + filePath.replace('./', '/');
            }
            
            this.parse(require(filePath), container, rootDir)
        }   
    }
}