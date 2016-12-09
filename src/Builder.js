'use strict';

let Parser = require('./Parser/Parser');
let Container = require('./Container');

module.exports = class Builder{
    
    constructor(servicesJson, rootDir) {
        this.rootDir = rootDir;
        this.parser = new Parser();
        this.servicesJson = servicesJson;
    }

    build(  ) {
        let container = new Container();

        this.parser.parse(this.servicesJson, container, this.rootDir);

        return container;
    }

}