'use strict';

let unit = require('unit.js');

let Builder = require('../src/Builder');
let TestService = require('./Mock/Mock.service');



describe('Builder', function () {
    it ('should create a container', function () {
        let builder = new Builder(
            {
                services: {
                    "testService": {
                        "file" : "./Mock/Mock.service.js" 
                    }
                }
            },
            __dirname
            
        );

        let container = builder.build();  
        
        unit.object(container).isNot(null);
    });

    it ('container should have service definitions', function () {
        let builder = new Builder(
            {
                services: {
                    "testService": {
                        "file": "./Mock/Mock.service.js",
                        "arguments" : []
                    }
                }
            },
            __dirname
        );

        let container = builder.build();
        unit.object(container.definitions.testService).isNot(null);
    });


    it ('service can be an object', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.object.js"
                },
                services: {
                    "testService": {
                        "file": "%testServiceFile%",
                        "isObject" : true,
                        "arguments" : []
                    }
                }
            },
            __dirname
        );

        let container = builder.build();
        unit.object(container.get('testService'));
        unit.string(container.get('testService').foo).is('bar');
    });

    it ('container should have parameters', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.service.js"
                },
                services: {
                    "testService": {
                        "file": "%testServiceFile%",
                        "arguments" : []
                    }
                }
            },
            __dirname
        );

        let container = builder.build();
        unit.string(container.parameters.testServiceFile).is("./Mock/Mock.service.js");
    });


    it ('referencing a not existent service should throw an error', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.service.js",
                    "otherFile" : "./Mock/Other.service.js"
                },
                services: {
                    "testService": {
                        "file": "%testServiceFile%",
                        "arguments": [],
                    },
                    "otherService": {
                        "file": "%otherFile%",
                        "arguments": ['@testService'],

                    }
                }
            },
            __dirname
        );

        let container = builder.build();
        
        function trigger() {
            unit.object(container.get('testService2')).isNot(null);
            unit.object(container.get('testService2')).isInstanceOf(TestService);
        }
        unit.exception(trigger);

        unit.object(container.get('otherService')).isNot(null);
        unit.object(container.get('otherService').service).isInstanceOf(TestService);
    });

    it ('referencing a not existent service should throw an error', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.service.js",
                    "otherFile" : "./Mock/Other.service.js"
                },
                services: {
                    "testService": {
                        "file": "%testServiceFile%",
                        "arguments": [],
                    },
                    "otherService": {
                        "file": "%otherFile%",
                        "arguments": ['@testService2'],

                    }
                }
            },
            __dirname
        );

        let container = builder.build();
        
        function trigger(){
            unit.object(container.get('testService')).isNot(null);
            unit.object(container.get('testService')).isInstanceOf(TestService);

            unit.object(container.get('otherService')).isNot(null);
            unit.object(container.get('otherService').service).isInstanceOf(TestService);
        }

        unit.exception(trigger);
    });

    it ('wrong config should throw an error', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.service.js",
                    "otherFile" : "./Mock/Other.service.js"
                },
                services: {
                    "testService": {
                    },
                    "otherService": {
                        "file": "%otherFile%",
                        "arguments": ['@testService2'],

                    }
                }
            },
            __dirname
        );


        function trigger(){
            let container = builder.build();
        
            unit.object(container.get('testService')).isNot(null);
        }
        unit.exception(trigger);

    });


    it ('instanciate used services', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.service.js",
                    "otherFile" : "./Mock/Other.service.js"
                },
                services: {
                    "otherService": {
                        "file": "%otherFile%",
                        "arguments": ['@testService'],
                    },
                    "testService": {
                        "file": "%testServiceFile%",
                        "arguments": [],
                    },
                    
                }
            },
            __dirname
        );

        let container = builder.build();

        unit.object(container.get('testService')).isNot(null);
        unit.object(container.get('testService')).isInstanceOf(TestService);

        unit.object(container.get('otherService')).isNot(null);
        unit.object(container.get('otherService').service).isInstanceOf(TestService);
    });

    it ('access parameters', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.service.js",
                    "otherFile" : "./Mock/Other.service.js"
                },
                services: {
                    "otherService": {
                        "file": "%otherFile%",
                        "arguments": ['@testService'],
                    },
                    "testService": {
                        "file": "%testServiceFile%",
                        "arguments": [],
                    },
                    
                }
            },
            __dirname
        );

        let container = builder.build();

        unit.string(container.getParameter('testServiceFile')).is('./Mock/Mock.service.js');
        unit.string(container.getParameter('otherFile')).is('./Mock/Other.service.js');
    });


    it ('access parameter by wrong name should throw an error', function () {
        let builder = new Builder(
            {
                parameters: {
                    "testServiceFile" : "./Mock/Mock.service.js",
                    "otherFile" : "./Mock/Other.service.js"
                },
                services: {
                    "otherService": {
                        "file": "%otherFile%",
                        "arguments": ['@testService'],
                    },
                    "testService": {
                        "file": "%testServiceFile%",
                        "arguments": [],
                    },
                    
                }
            },
            __dirname
        );

        let container = builder.build();

        function trigger(){
            unit.string(container.getParameter('testServiceFile2')).is('./Mock/Mock.service.js');
        }

        unit.exception(trigger);
        unit.string(container.getParameter('otherFile')).is('./Mock/Other.service.js');
    });

});