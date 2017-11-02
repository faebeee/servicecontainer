# ServiceContainer

![Build](https://circleci.com/gh/faebeee/servicecontainer/tree/master.svg?style=svg&circle-token=50472bb3d7dbbb77fd1138181c19d6ed84d87dfd)

A servicecontainer build on javascript. It works with browserify, ES6, babel and so on

# Install 
Install the module using `npm`

  `npm i servicecontainer --save`

# Example

Checkout the working example on `/example/Node`

# Setup

## Create the config

When we create a new container we have to provide a config file which holds the configurations
of all available services

    let container = ServiceContainer.create(__dirname+'/Config/Services.json');

Therefore we can create a single file with all the configurations in it or we can split it up into smaller
and more maintainable pieces

### Config structure

basically there are two types of services that can be configured. One is a class
and the other is a object. Tha class will be instanciated when required. To object
is a basic JSON object

A service object can be configured like this:

     "SERVICE_NAME": {
        "file": RELATIVE_PATH_TO_CLASS_FILE,
        "arguments" : ARRAY_OF_ARGUMENTS,
        "tags" : ARRAY_OF_TAGS
    }


**Keys :** 

`file` Relative path to the service file

`arguments` Array of strings which reference either a service or a parameter.
To reference a service add the servicename with `@` as prefix. If you need a parameter then wrap it with `%`.

    "arguments" : ["@serviceName" ,"%parameter.name%"]


`tags` Array of strings. The service can later be accessed by that string

`isObject` Defines if the service is an object or an class. If the service is a class, the service will be created with 
`new` otherwise it will be a basic json object.


### Single config file

    {
        "parameters" : {
            "name" : "foo bar"
        }
    
        "services": {
            "helloService": {
                "file": "../Services/HelloService.js",
                "arguments" : ["%name%"]
            }
        }
    }

### Granular config files

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
          "file": "../Services/HelloService.js",
          "arguments" : ["%name%"]
        }
      }
    }

(you can also just work with one single config file)

### Reference a parameter

When you have some parameters that are required in a service like a hostname, username or directory path,
you can setup a simple parameter in your config.

     {
        "parameters" : {
            "name" : "foo bar"
        }
    }

Now in your service configuration you can reference to that parameter when setting the arguments array

    "services": {
        "helloService": {
          "file": "../Services/HelloService.js",
          "arguments" : ["%name%", "%more.modular.approach.value%"] // <-- Access the value by the parameter name
        }
      }

### Reference a service

When you require another service within your service you can go a similar way like the one to reference a parameter.

    "services": {
        "helloService": {
            "file": "../Services/HelloService.js",
            "arguments" : ["%name%"]
        },
        "myOtherHelloService": {
            "file": "../Services/OtherHelloService.js",
            "arguments" : ["@helloService"] // <-- The name of the other service
        }
    }


## Create a Service class/object

A service is a class that provides some method and functionallity. That class can have additional dependencies and parameters that can be configured via our `json` file

HelloService.js

    'use strict';
    
    module.exports = class HelloService{
        constructor(name){ // recive all the arguments configured in the json file
            this.name = name;
        }
    
        sayHello(){
            console.log('Hi '+this.name)
        }
    };

## Start the container 

Check out the `/example` folder
 
App.js
 
    // load module
    let ServiceContainer = require('servicecontainer');
    
    //create container with service configuration
    let container = ServiceContainer.create(__dirname+'/Config/Services.json');
    
    //do what ever you want with your service
    container.get('helloService').sayHello();
    console.log("Parameter : "+container.getParameter('name'));


## Access the container
You can access the created container from everywhere by either get the service

    let myContainer = container.get('container')

or reference it in the config

    "services": {
        "helloService": {
          "file": "../Services/HelloService.js",
          "arguments" : [
              "%name%",
              "@container" // <-- access the whole container
            ]
        }
      }

or since the container is cached in the module you can call (only works if you already created one before)

    let ServiceContainer = require('servicecontainer')
    let container = ServiceContainer.get();



# Default Parameters

## app.root
    process.cwd

## app.env
    process.env.NODE_ENV || 'prod'

    
# API

[API Doc](docs/index.html)