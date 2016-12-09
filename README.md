# ServiceContainer

A servicecontainer build on javascript. It works with browserify, ES6, babel and so on

# How To
## Install 
  Install the module using `npm`

  npm i @faebeee/service-container --save

## Create services
Create some services and fill them with your business logic. 
You don't have to follow any coding guideline (but use es6 classes because they're fancy ;) )

File: Mock.service.js

    'use strict';
    module.exports = class MockService{
        constructor() {
            
        }

    }

File: Other.service.js

    'use strict';
    module.exports = class OtherService{
        constructor( testService ) {
            this.service = testService;
        }
    }

## Create Config
First of all you have to create a config file.
This is where all your services are configured.
This is basically a json file. But you can add your own object
when calling the `Builder`.

    {
        parameters: {
        "testServiceFile" : "Mock/Mock.service.js",
        "otherFile" : "Mock/Other.service.js"
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
    }

The config file is very similar to the symfony 2 service definitions.
When you define the classpath/filepath be carefull to provide the path relative 
to the location of the current config file/object.

In this example we have two services. The `testService` is just a service that doesn't need
any arguments passed in the constructor.
The other service `otherService` takes the first service as argument.

## Build the container
Now that we create all the services we need to create the container.

Therefore we need to create a new `Builder` instance like this

    let Builder = require('@faebeee/service-container');

    let builder = new Builder(
      require('./Config/Services.json'),
      __dirname+"/services"
    );

The first argument is a json object that stores all your service configuration. 
You can also pass a json object directly

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
      __dirname+"/services"        
    );

And then finally

    let container = builder.build();

This initializes the services (but doesn't create them. They will be created when they're requested to minimize load)

## 4. Use the contianer
now that the container has been created you can access your services

    container.get('testService')

Or access the parameter

    container.get('testService')
    