'use strict';

let unit = require('unit.js');
let path = require('path');

const Container = require("../bin/Container").default;

let MockService = require('./Mock/Mock.service');
let OtherService = require('./Mock/Other.service');

describe('Container API', function () {
    it("_fillParameter", () => {
        const container = new Container(path.join(__dirname, "/Mock/Services.json"));
        const param = container._fillParameter("test/Mock/%variableServiceFile%");
        unit.string(param).is("test/Mock/./TestContainer.service.js");
    });
});
