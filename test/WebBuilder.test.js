'use strict';

let unit = require('unit.js');

let ServiceContainer = require('../ServiceContainer');

let MockService = require('./Mock/Mock.service');
let OtherService = require('./Mock/Other.service');

describe('Web Builder', function () {
    it('should create a container', function () {
        let container = ServiceContainer.buildFromJson({
            "services": {
                "testService": {
                    "file": "./Mock/Mock.service.js"
                }
            }
        }, {
            "./Mock/Mock.service.js" : require('./Mock/Mock.service')
        });
        
        unit.object(container).isNot(null);
    });


    it('get services', function () {
        let container = ServiceContainer.buildFromJson({
            "services": {
                "testService": {
                    "file": "./Mock/Mock.service.js"
                }
            }
        }, {
            "./Mock/Mock.service.js" : require('./Mock/Mock.service')
        });

        unit.object(container.get('testService')).isNot(null);
        unit.object(container.get('testService')).isInstanceOf(MockService);
    });

    it('get multiple services', function () {
        let container = ServiceContainer.buildFromJson({
            "services": {
                "mock": {
                    "file": "./Mock/Mock.service.js"
                },
                "other": {
                    "file": "./Mock/Other.service.js"
                }
            }
        }, {
            "./Mock/Mock.service.js" : require('./Mock/Mock.service'),
            "./Mock/Other.service.js" : require('./Mock/Other.service')
        });

        unit.object(container.get('mock')).isNot(null);
        unit.object(container.get('other')).isNot(null);
        unit.object(container.get('mock')).isInstanceOf(MockService);
        unit.object(container.get('other')).isInstanceOf(OtherService);
    });


    it('throw error when no servicedefinition is given', function () {
        function loadServiceWithoutClassDef() {

            let container = ServiceContainer.buildFromJson({
                "services": {
                    "mock": {
                        "file": "./Mock/Mock.service.js"
                    },
                    "other": {
                        "file": "./Mock/Other.service.js",
                    }
                }
            }, {
                "./Mock/Mock.service.js" : require('./Mock/Mock.service'),
            });

            unit.object(container.get('mock')).isNot(null);
            unit.object(container.get('other')).isNot(null);
            unit.object(container.get('mock')).isInstanceOf(MockService);
            unit.object(container.get('other')).isInstanceOf(OtherService);
        }


        unit.exception(loadServiceWithoutClassDef);

    });

    it('inject service into service', function () {

        let container = ServiceContainer.buildFromJson({
            "services": {
                "mock": {
                    "file": "./Mock/Mock.service.js"
                },
                "other": {
                    "file": "./Mock/Other.service.js",
                    "arguments" : ["@mock"]
                }
            }
        }, {
            "./Mock/Mock.service.js" : require('./Mock/Mock.service'),
            "./Mock/Other.service.js" : require('./Mock/Other.service'),
        });

        unit.object(container.get('mock')).isNot(null);
        unit.object(container.get('other')).isNot(null);
        unit.object(container.get('other').service).isNot(null);
        unit.object(container.get('mock')).isInstanceOf(MockService);
        unit.object(container.get('other')).isInstanceOf(OtherService);
        unit.object(container.get('other').service).isInstanceOf(MockService);

    });


    it('inject parameter into service', function () {

        let container = ServiceContainer.buildFromJson({
            "parameters" : {
                "foo" : "bar"
            },
            "services": {
                "mock": {
                    "file": "./Mock/Mock.service.js",
                    "arguments" : ["%foo%"]
                },
                "other": {
                    "file": "./Mock/Other.service.js",
                    "arguments" : ["@mock"]
                }
            }
        }, {
            "./Mock/Mock.service.js" : require('./Mock/Mock.service'),
            "./Mock/Other.service.js" : require('./Mock/Other.service'),
        });

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

        let container = ServiceContainer.buildFromJson({
            "services": {
                "object": {
                    "file": "./Mock/Object.service.js",
                    "isObject" : true
                },
            }
        }, {
            "./Mock/Object.service.js" : require("./Mock/Object.service.js"),
        });

        unit.object(container.get('object')).isNot(null);
        unit.string(container.get('object').foo).is('bar');

    });


    it('throw error when parameter does not exist', function () {
        function loadServiceWithoutClassDef() {
            let container = ServiceContainer.buildFromJson({
                "services": {
                    "object": {
                        "file": "./Mock/Object.service.js",
                        "isObject" : true
                    },
                }
            }, {
                "./Mock/Object.service.js" : require("./Mock/Object.service.js"),
            });


            container.getParameter('mock2');
        }

        unit.exception(loadServiceWithoutClassDef);

    });

    it('get services by tag', function () {

        let container = ServiceContainer.buildFromJson({
            "services": {
                "mock": {
                    "file": "./Mock/Mock.service.js",
                    "tags" : ["mock"]
                },
                "other": {
                    "file": "./Mock/Other.service.js",
                    "tags" : ["mock"]
                }
            }
        }, {
            "./Mock/Mock.service.js" : require('./Mock/Mock.service'),
            "./Mock/Other.service.js" : require('./Mock/Other.service')
        });

        unit.array(container.getServicesByTag('mock')).hasLength(2);

    });


    it('get scaffolded parameter', () => {

        let container = ServiceContainer.buildFromJson({
            "parameters" : {
                "foo" : "bar",
                "test" : {
                    "name" : "world"
                },
                "ref" : "%foo% bar"
            }
        });

        unit.string(container.getParameter('test.name')).is('world');
    });


    it('get parameter with reference', () => {
        let container = ServiceContainer.buildFromJson({
            "parameters" : {
                "foo" : "bar",
                "test" : {
                    "name" : "world"
                },
                "ref" : "%foo% bar"
            }
        });
        unit.string(container.getParameter('ref')).is('bar bar');
    });

});