'use strict';
let AbstractClassLoader = require('./AbstractClassLoader');

module.exports = class WebClassLoader extends AbstractClassLoader{

    /**
     *
     * @param services
     */
    constructor( services ){
        super();
        this.servicesClasses = services;
    }
   

    /**
     * Load classdefinition from module
     *
     * @param {Container} container
     * @param {Definition} def
     * @returns {Class}
     */
    loadModuleClassDefiniton(container, def){

        if(def.file === null){
            return;
        }

        let classFile = null;

        if (container.isArgumentALiteral(def.file)) {
            classFile = def.file;
        } else {
            classFile = container.getParameter(
                container.getParameterIdFromArgumentReference(def.file)
            );
        }

        if(!classFile){
            throw new Error('File is not defined in config');
        }

        //classFile = def.rootDir + classFile.replace('./', '/');
        if(this.servicesClasses[classFile] === null || this.servicesClasses[classFile] === undefined){
            throw new Error('No service class for '+classFile);
        }

        return this.servicesClasses[classFile]
    }

    
};