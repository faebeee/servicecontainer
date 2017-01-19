'use strict';

let NodeParser = require('./Parser/NodeParser');
let WebParser = require('./Parser/WebParser');

let NodeClassLoader = require('./Loader/NodeClassLoader');
let WebClassLoader = require('./Loader/WebClassLoader');

let Container = require('./Container');

module.exports = class Builder{

    constructor() {
    }

    /**
     * Build services by given json
     * @returns {Container}
     */
    build( json ) {

    }

    /**
     * Build services from json data
     * @returns {Container}
     */
    buildFromJson( json, services ) {
        let container = new Container(new WebClassLoader(services));
        let parser = new WebParser();
        parser.parse(json, container);
        return container;
    }

    /**
     * Build Json from file
     * @returns {Container}
     */
    buildFromFile( file ) {
        let container = new Container( new NodeClassLoader() );
        let parser = new WebParser();
        parser.parse(require(file), container);
        return container;
    }

}