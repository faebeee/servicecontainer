'use strict';

let unit = require('unit.js');

let ServiceContainer = require('../');

let MockService = require('./Mock/Mock.service');
let OtherService = require('./Mock/Other.service');

describe('Module', function () {

    describe('corrupt config', function () {
        beforeEach(() => {
            this.container = ServiceContainer.create(__dirname + '/Mock/ServicesCorrupt.json');
        });

        afterEach(() => {
            ServiceContainer.destroy();
        });

        it('throw exception when service cannot be created', () => {
            let trigger = function () {
                this.container.get('corrupt')
            };
            unit.exception(trigger);
        });
    });

    describe('valid config', function () {
        beforeEach(() => {
            this.container = ServiceContainer.create(__dirname + '/Mock/Services.json');
        });

        afterEach(() => {
            ServiceContainer.destroy();
        });

        it('create a container', () => {
            unit.object(this.container).isNot(null);
        });

        it('get container as a service', () => {
            unit.object(this.container.get('container')).isNot(null);
            unit.object(this.container.get('container')).is(this.container);
        });


        it('get cached', () => {
            unit.object(this.container).isIdenticalTo(ServiceContainer.get());
        });

        it('destroy cached', () => {
            ServiceContainer.destroy();
            unit.value(ServiceContainer.get()).isNull();
        });
    })

});
