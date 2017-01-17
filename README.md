# ServiceContainer

A servicecontainer build on javascript. It works with browserify, ES6, babel and so on

# How To 
## Install 
  Install the module using `npm`

  npm i @faebeee/service-container --save

## Create services (NodeJs)
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


## Create Services (Web)
Since we can't require files dynamically in the browser using `require` (even with browserify)
we have to create classes/functions globally. The best case here woul be to work with gulp and concat all services
into one file and load it in your browser.

## Create Config
First of all you have to create a config file.
This is where all your services are configured.
This is basically a json file. But you can add your own object
when calling the `Builder`.

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
    }

Note that your relative path has to start with `./` or `../`

The config file is very similar to the symfony 2 service definitions.
When you define the classpath/filepath be carefull to provide the path relative 
to the location of the current config file/object.

In this example we have two services. The `testService` is just a service that doesn't need
any arguments passed in the constructor.
The other service `otherService` takes the first service as argument.

### Config Service options
A service can have a couple of different config options

`file` : String
the path to the service class

`arguments` : Array
Arguments that are passed to the service constructor. If you want to pass a service reference
prepent a `@` followed by the service name. For a parameter surround the parametername with `%`


`isObject` : Boolean
define if the service is a class or a simple objects that doesn't require any instanciation

`className` : String
this is used when you want to use this module in your browser. The problem there is that we can't
require files in the browser. This property can be a function/class name that is available globally. 
(Add your services globally and set their classname here )   


## Build the container
Now that we create all the services we need to create the container.

Therefore we need to create a new `Builder` instance like this

    let Builder = require('@faebeee/service-container').Builder;

    let builder = new Builder(
      __dirname+"/Config/"
    );

The first argument is a json object that stores all your service configuration.
The second one is the path pointing to the configuration folder. This is used to fetch your services. 
You can also pass a json object directly

    let builder = new Builder(
      __dirname+"/Config/"        
    );

And then finally

    let container = builder.build(require('./path/to/services.json'));

Or if you run in a node environment

    let container = builder.buildFromFile('./path/to/services.json');

This initializes the services (but doesn't create them. They will be created when they're requested to minimize load)

## 4. Use the contianer
now that the container has been created you can access your services

    container.get('testService')

Or access the parameter

    container.getParameter('testServiceFile')
    


# API

## getParameter (name:String)
Get parameter from your configfily 

## get (name:String)
Get a service by the given name

## getServicesByTag(tag:String)
get services with given tag