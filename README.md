# ServiceContainer

![Build](https://circleci.com/gh/faebeee/servicecontainer/tree/master.svg?style=svg&circle-token=50472bb3d7dbbb77fd1138181c19d6ed84d87dfd)

A servicecontainer build on javascript. It works with browserify, ES6, babel and so on

# Install 
Install the module using `npm`

  `npm i servicecontainer --save`

# Example

Checkout the working example on `/example/Node`

# Default Parameters

## app.root
    process.cwd

## app.env
    process.env.NODE_ENV || 'prod'


# Create Config

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

(you can also just work with one single config file)

    {
        "parameters" : {
            "name" : "foo bar"
        }
    
        "services": {
            "helloService": {
                "file": "../Services/Hello.service.js",
                "arguments" : ["%name%"]
            }
        }
    }
    
## Configure a Service class/object

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

## Create a Service class/object

Hello.service.js

    'use strict';
    
    module.exports = class HelloService{
        constructor(name){ // recive all the arguments configured in the json file
            this.name = name;
        }
    
        sayHello(){
            console.log('Hi '+this.name)
        }
    };
    
# Usage

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
          "file": "../Services/Hello.service.js",
          "arguments" : [
              "%name%",
              "@container"
            ]
        }
      }

or since the container is cached in the module you can call (only works if you already created one before)

    let ServiceContainer = require('servicecontainer')
    let container = ServiceContainer.get();

    
# API

[API Doc](docs/index.html)