let ServiceContainer = require('../../ServiceContainer');

let container = ServiceContainer.buildFromJson(
    require(__dirname+'/Config/Services.json'),

    // Here we have to link the services configured in the json to a specific class.
    // this has to be done because there is no chance to load them dynamically in the browser runtime
    {
        "../Services/Hello.service.js" : require("./Services/Hello.service.js")
    }
);

container.get('helloService').sayHello();

console.log("Parameter : "+container.getParameter('name'));