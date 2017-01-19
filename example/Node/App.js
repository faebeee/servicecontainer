let ServiceContainer = require('../../ServiceContainer');

let container = ServiceContainer.buildFromFile(__dirname+'/Config/Services.json');

container.get('helloService').sayHello();

console.log("Parameter : "+container.getParameter('name'));