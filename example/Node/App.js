let ServiceContainer = require('../../src/ServiceContainer');

let container = ServiceContainer.create(__dirname+'/Config/Services.json');

container.get('helloService').sayHello();
