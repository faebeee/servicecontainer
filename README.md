# ServiceContainer

![Build](https://circleci.com/gh/faebeee/servicecontainer/tree/master.svg?style=svg&circle-token=50472bb3d7dbbb77fd1138181c19d6ed84d87dfd)

`servicecontainer` is a zero dependency dependency injection for nodejs applications. 

# Install 
Install the module using `npm`

  `npm i servicecontainer --save`

# Example

Checkout the working example on `/example`

- Basic Express example [Repo](https://github.com/faebeee/servicecontainer-example-express)

# Setup

## Create the service configuration file
All the service definitions are configured in a `json` file. Therefore we create 
a `/config` folder in your application (It doesn't have to be in the app root since the
file reference is relative to the config file).

The config file looks something like this
    
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
    
The config file has 3 main keys `parameters`, `services` and `imports`

- `parameters` Will contain configurations for services (these will be parameters like 
portnumber and other config objects). These might be different depending on the environment

- `services` Here all available services are configured. The keys have to be unique since that
is the key you pass to retrieve the service.

- `imports` here you can import other configurations files. This way you can have a more granular configuration and
it makes it easier to have different parameters per environment and not have to write duplicated service configuration 

## Create a container and load the configuration
Now that we have our configuration we are ready to create a container. Therefore we have to load the `servicecontainer` code.
Thats done by

    const ServiceContainer = require('servicecontainer');
    
Next we create a new container instance by calling `create` with the configfile as parameter on `ServiceContainer`

    let container = ServiceContainer.create(__dirname+'/config/service.json');

This normaly goes where your application boots/starts. Something like `/index.js` but
it's not mandatory.

## Use service
Now that we have everything up and running, we can access the configured service.
That is done by calling `get` on the container and passing the service key from the configuration file.

    container.get('helloService').myFancyMethod();


# Create a service
To create a service we have two steps to do. First create your class.

Example: HelloService.js

    module.exports = class HelloService {
        constructor(name){
            this.name = name;
        }
        
        myMethod1(){
            ...
        }

        myMethod2(){
            ...
        }
    }

You see it's very simple. Just a class which required a parameter called `name`. 
That parameter will be passed by the `servicecontaine` module since it's configured
in the config file 
    
    ...
    "arguments" : ["%name%"]
    ...

Now that we have created out class, we configure it in the config file and we are done.
(Look above)

# Configuration
At the beginning the configuration can be a bit tricky. But I got your back!
As mentioned above the configuration file exists of three parts. The `imports`,
`parameters` and the `services`.

## `imports`
`imports` has to be an array. Here you can reference other configuration files. The 
path to those files is relative to the current one. The `import` files will be 
loaded prior to the current file. So if you have a parameter `name` in one of the imported
files and tha same parameter in your current file, the current file overwrites the value.

To create some environment dependent config checkout the `example/environment` folder

## `parameters`
Parameters is a key value object. It's very simple

    {
        "parameters" : {
            "name" : "foo bar",
            "port" : 8000
        }
    }

## `services`
The service configuration is very straight foreward. The object has to have a unique key.
This key is later used to get access to that class/service.
The config object of that service has some keys you have to set and some are optional.

|key|value|type|default|
|---|---|---|---|
|file|Relative path to the class file|required||
|arguments|Array of parameters that are passed to the constructor when the service is created|required||
|tags|Array of strings. You can get an array of services with the same tag|optional|`[]`|
|isObject|Define if the service/class has to be instanciated with `new` when getting it |optional|`false`|

### `arguments`
You can pass three different types of parameters. A normal string, a reference to a `parameter` or an other `service`.

Pass a string

    "arguments" : ["hello"]

Reference a parameter. Parameter key is wrapped with `%`

    "arguments" : ["%hello%"]

Reference another servcie. Prefix the service key/name with a `@`
    
    "arguments" : ["@helloService"]

### `tags`
You can define an array of tags. You can access multiple services with tha same tags later.
That might be good when you have different eventlisteners, that have to be started 
on application start. You can call `getServicesByTag` on the `container` object and pass
the tag you want and you'll receive an array of services.

### `isObject`
You also have the possibility to add object as services and not classes.
When `isObject` is set to `true` then the `service` will not bi instanciated with `new`.
This gives you the ability to pass an object as a service.

# Use a service
After you created the config and `service` file, you can access the service and call it's methods. In addition the `container` created with `ServiceContainer.create` is cached in
the module. This gives you the ability to load the `servicecontainer` module everywhere in your code. Then you can call `.get` on the module and you'll get the current
container instance.
    
# API
## Module
### `.create(configFilePath:String) : Container`
Create a new container instance. 

### `.get() : Container`
Get the created container

### `.destroy()`
Destroy the currently active container

## Container
### `.getParameter(name:String) : any`
Get a parameter by it's name

### `.getServicesByTag(tag:String) : Array`
Get multiple services by the same tag

### `.get(name:String) : any`
Get service by it's name

# Complete API Doc
[API Doc](https://faebeee.github.io/servicecontainer/)
