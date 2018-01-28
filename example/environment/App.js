'use strict';

const ServiceContainer = require('../../src');
const env = process.env.NODE_ENV || 'prod'; 
const container = ServiceContainer.create(__dirname + `/Config/Services.${env}.json`);

container.get('helloService').sayHello();
