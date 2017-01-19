'use strict';

let Definition = require('../Definition');
let AbstractParser = require('./AbstractParser');

module.exports = class WebParser extends AbstractParser{

    /**
     *
     * @param services
     */
    constructor( services ){
        super();
        this.servicesClasses = services;
    }

    /**
     * 
     * @param {Object} data
     * @param {Container} container
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
            
            this.parse(this.servicesClasses[value], container)
        }   
    }
};