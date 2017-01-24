'use strict';
let AbstractClassLoader = require('./AbstractClassLoader');

module.exports = class ClassLoader extends AbstractClassLoader{

    constructor(rootDir){
        super();
        this.rootDir = rootDir;
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

        if (container._isArgumentALiteral(def.file)) {
            classFile = def.file;
        } else {
            classFile = container.getParameter(
                container._getParameterIdFromArgumentReference(def.file)
            );
        }

        if(!classFile){
            throw new Error('File is not defined in config');
        }

        // Check if the class file path is relative or absolute
        classFile = classFile.replace(/^\.\.\//, './../');
        if (/^\.\//.test(classFile)) {
            // Remove references to the root dir
            classFile = this.rootDir + classFile.replace('./', '/');
        }
        //classFile = def.rootDir + classFile.replace('./', '/');
        return require(classFile);
    }

};