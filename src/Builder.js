'use strict';

let Parser = require('./Parser/Parser');
let Container = require('./Container');

module.exports = class Builder{

    /**
     *
     * @param {string} rootDir
     */
    constructor(rootDir) {
        this.rootDir = rootDir;
        this.parser = new Parser(rootDir);
        
    }

    /**
     * Build services by given json
     * @returns {Container}
     */
    build( json ) {
        this.servicesJson = json;
        let container = new Container();
        this.parser.parse(this.servicesJson, container);
        return container;
    }

    /**
     * Build Json from file
     * @returns {Container}
     */
    buildFromFile( file ) {
        let container = new Container();
        this.parser.parse(require(this.rootDir+file), container);
        return container;
    }

};