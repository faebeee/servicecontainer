'use strict';

module.exports = class AbstractClassLoader{
    
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
        throw 'Method not implemented';
    }

};