'use strict';

let unit = require('unit.js');

let ServiceContainer = require('../ServiceContainer');

let MockService = require('./Mock/Mock.service');
let OtherService = require('./Mock/Other.service');

describe('Node Builder', function () {
    it('should create a container', function () {
        let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

        unit.object(container).isNot(null);
    });


    it('get services', function () {
        let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

        unit.object(container.get('mock')).isNot(null);
        unit.object(container.get('mock')).isInstanceOf(MockService);
    });

    it('get multiple services', function () {
        let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

        unit.object(container.get('mock')).isNot(null);
        unit.object(container.get('other')).isNot(null);
        unit.object(container.get('mock')).isInstanceOf(MockService);
        unit.object(container.get('other')).isInstanceOf(OtherService);
    });


    it('throw error when no no is given', function () {
        function loadServiceWithoutClassDef() {
            let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

            unit.object(container.get('mock2')).isNot(null);
        }

        unit.exception(loadServiceWithoutClassDef);

    });


    it('throw error when parameter does not exist', function () {
        function loadServiceWithoutClassDef() {
            let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

            container.getParameter('mock2');
        }

        unit.exception(loadServiceWithoutClassDef);

    });

    it('inject service into service', function () {

        let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

        unit.object(container.get('mock')).isNot(null);
        unit.object(container.get('other')).isNot(null);
        unit.object(container.get('other').service).isNot(null);
        unit.object(container.get('mock')).isInstanceOf(MockService);
        unit.object(container.get('other')).isInstanceOf(OtherService);
        unit.object(container.get('other').service).isInstanceOf(MockService);

    });


    it('inject parameter into service', function () {

        let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

        unit.object(container.get('mock')).isNot(null);
        unit.object(container.get('other')).isNot(null);
        unit.object(container.get('other').service).isNot(null);

        unit.object(container.get('mock')).isInstanceOf(MockService);
        unit.object(container.get('other')).isInstanceOf(OtherService);
        unit.object(container.get('other').service).isInstanceOf(MockService);

        unit.string(container.get('mock').data).is('bar');
        unit.string(container.getParameter('foo')).is('bar');

    });

    it('access objects', function () {

        let container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');

        unit.object(container.get('object')).isNot(null);
        unit.string(container.get('object').foo).is('bar');

    });

});