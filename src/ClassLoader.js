'use strict';

module.exports = class ClassLoader{
    
    /**
     * Preload class definition 
     *
     * @param {Container} container
     * @param {Definition} def
     */
    loadClass(container, def){
        if(def.file === null && def.className === null) {
            throw new Error('Neither a class nor a file is defined for service')
        }

        if(def.className !== null){
            def.class = this.loadGlobalClassDefinition(def);
            return;
        }

        def.class = this.loadModuleClassDefiniton(container, def);
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
            classFile = def.rootDir + classFile.replace('./', '/');
        }
        
        //classFile = def.rootDir + classFile.replace('./', '/');
        return require(classFile);
    }

    /**
     * Load class definition for global class/function
     * 
     * @param {Definition} def
     * @returns {Function}
     */
    loadGlobalClassDefinition(def){

        let serviceClassName = def.className;

        if(window !== undefined &&
            serviceClassName && 
            window[serviceClassName] !== undefined && 
            typeof window[serviceClassName] === 'function'
            ){
            return window[serviceClassName];
        }
        return null;
    }
}