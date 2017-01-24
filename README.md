# ServiceContainer

A servicecontainer build on javascript. It works with browserify, ES6, babel and so on

# Install 
  Install the module using `npm`

  npm i servicecontainer --save

# Usage Node

Checkout the working example on `/example/Node`

## Config

Parameters.json

    {
      "parameters" : {
        "name" : "foo bar"
      }
    }

Services.json

    {
      "imports" : [
        "./Parameters.json"
      ],
    
      "services": {
        "helloService": {
          "file": "../Services/Hello.service.js",
          "arguments" : ["%name%"]
        }
      }
    }
    
 ## Services
 
 Hello.service.js
 
    'use strict';
    
    module.exports = class HelloService{
        constructor(name){
            this.name = name;
        }
    
        sayHello(){
            console.log('Hi '+this.name)
        }
    };
    
 ## Applicaition
 
 App.js
 
    let ServiceContainer = require('servicecontainer');
    
    let container = ServiceContainer.buildFromFile(__dirname+'/Config/Services.json');
    
    container.get('helloService').sayHello();
    
    console.log("Parameter : "+container.getParameter('name'));
    
    
    
    
 # Usage Web
 
 For web no imports are supported due to browserlimitations and no filesystem.
 
 In order to make it work in the browser you have to use browserify.
 In addition, you have to load the classes in a bit different way, so that the browser is
 aware of all required classes!
 
 
Services.json

    {
      "parameters" : {
        "name" : "foo bar"
      },
    
      "services": {
        "helloService": {
          "file": "../Services/Hello.service.js",
          "arguments" : ["%name%"]
        }
      }
    }
    
 ## Services
 
 Hello.service.js
 
    'use strict';
    
    module.exports = class HelloService{
        constructor(name){
            this.name = name;
        }
    
        sayHello(){
            console.log('Hi '+this.name)
        }
    };
    
 ## Application
 
 App.js
 
    let ServiceContainer = require('servicecontainer');
    
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
    
    
    
# API


## class ServiceContainer 

### buildFromJson(json:Object, services:Object) : Container
this is used to create the container for the web environment

    let container = ServiceContainer.buildFromJson(
            require(__dirname+'/Config/Services.json'),
        
            // Here we have to link the services configured in the json to a specific class.
            // this has to be done because there is no chance to load them dynamically in the browser runtime
            {
                "../Services/Hello.service.js" : require("./Services/Hello.service.js")
            }
        );


### buildFromFile(file:String) : Container
Used to create the container for nodejs 
    
    
    let container = ServiceContainer.buildFromFile(__dirname+'/Config/Services.json');
    
    
## class Container

### get(name:String) : Object
This returns the service instance for the given name

### getServicesByTag(tag:String) : Object[]
Returns an array with services that have a specific tag

### getParameter(name:String) : Object
Returns a parameter configured under `parameters` in your configfile


# Container
The container has some default parameters that can be very useful.

## app.root : String (nodejs)
returns the value of `process.cwd()`. This can be usefull if you define some references to other config files or sqlite databases:

    
    "parameters": {
        ...
        "sqlite.file" : "%app.root%/resources/data/db.sqlite",
        "packagejson.file" : "%app.root%/package.json"
        ...
    }