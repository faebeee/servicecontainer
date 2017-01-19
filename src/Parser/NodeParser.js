'use strict';

let Definition = require('../Definition');
let AbstractParser = require('./AbstractParser');

module.exports = class NodeParser extends AbstractParser{
    /**
     *
     * @param {String} rootDir
     */
    constructor(rootDir) {
        super();
        this.rootDir = rootDir;
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

            let importFile = this.rootDir + value.replace('./', '/');
            this.parse(require( importFile ), container)
        }   
    }
};