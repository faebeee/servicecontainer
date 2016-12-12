'use strict';

module.exports = class Definition{
    constructor() {
        this.file = null;
        this.arguments = null;
        this.rootDirectory = null;
        this.isClass = null;
        this.class = null;
        this.properties = null;
        this.calls = [];
        this.tags = null;
    }
}