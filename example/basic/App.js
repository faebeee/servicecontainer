'use strict';

const ServiceContainer = require('../../src');
const container = ServiceContainer.create(__dirname + '/Config/Services.json');

container.get('helloService').sayHello();
