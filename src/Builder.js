'use strict';

let path = require('path');

let NodeParser = require('./Parser/NodeParser');
let WebParser = require('./Parser/WebParser');

let NodeClassLoader = require('./Loader/NodeClassLoader');
let WebClassLoader = require('./Loader/WebClassLoader');

let Container = require('./Container');

module.exports = class Builder{

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
    buildFromFile( file) {
        let configFolder = path.dirname( file );
        let container = new Container( new NodeClassLoader( configFolder ) );
        let parser = new NodeParser( configFolder );
        parser.parse(require( file ), container);
        return container;
    }
};