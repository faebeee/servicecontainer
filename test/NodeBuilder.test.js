'use strict';

let unit = require('unit.js');

let ServiceContainer = require('../ServiceContainer');

let MockService = require('./Mock/Mock.service');
let OtherService = require('./Mock/Other.service');

describe('Node Builder', function () {

    before( () => {
        this.container = ServiceContainer.buildFromFile(__dirname+'/Mock/Services.json');
    });

    it('should create a container', () => {
        unit.object(this.container).isNot(null);
    });


    it('get services', () => {

        unit.object(this.container.get('mock')).isNot(null);
        unit.object(this.container.get('mock')).isInstanceOf(MockService);
    });

    it('get multiple services', () => {
        unit.object(this.container.get('mock')).isNot(null);
        unit.object(this.container.get('other')).isNot(null);
        unit.object(this.container.get('mock')).isInstanceOf(MockService);
        unit.object(this.container.get('other')).isInstanceOf(OtherService);
    });

    it('throw error when no no is given', () => {
        function loadServiceWithoutClassDef() {
            unit.object(this.container.get('mock2')).isNot(null);
        }
        unit.exception(loadServiceWithoutClassDef);
    });

    it('throw error when parameter does not exist', () => {
        function loadServiceWithoutClassDef() {
            this.container.getParameter('mock2');
        }
        unit.exception(loadServiceWithoutClassDef);
    });

    it('inject service into service', () => {
        unit.object(this.container.get('mock')).isNot(null);
        unit.object(this.container.get('other')).isNot(null);
        unit.object(this.container.get('other').service).isNot(null);
        unit.object(this.container.get('mock')).isInstanceOf(MockService);
        unit.object(this.container.get('other')).isInstanceOf(OtherService);
        unit.object(this.container.get('other').service).isInstanceOf(MockService);
    });

    it('inject parameter into service', () => {
        unit.object(this.container.get('mock')).isNot(null);
        unit.object(this.container.get('other')).isNot(null);
        unit.object(this.container.get('other').service).isNot(null);

        unit.object(this.container.get('mock')).isInstanceOf(MockService);
        unit.object(this.container.get('other')).isInstanceOf(OtherService);
        unit.object(this.container.get('other').service).isInstanceOf(MockService);

        unit.string(this.container.get('mock').data).is('bar');
        unit.string(this.container.getParameter('foo')).is('bar');
    });

    it('access objects', () => {
        unit.object(this.container.get('object')).isNot(null);
        unit.string(this.container.get('object').foo).is('bar');

    });

    it('get services by tag', () => {
        unit.array(this.container.getServicesByTag('mock')).hasLength(2);

    });

    it('get scaffolded parameter', () => {
        unit.string(this.container.getParameter('test.name')).is('world');
    });


    it('get parameter with reference', () => {
        unit.string(this.container.getParameter('ref')).is('bar bar');
    });

});