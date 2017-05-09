# ServiceContainer

![Build](https://circleci.com/gh/faebeee/servicecontainer/tree/master.svg?style=svg&circle-token=50472bb3d7dbbb77fd1138181c19d6ed84d87dfd)

A servicecontainer build on javascript. It works with browserify, ES6, babel and so on

# Install 
Install the module using `npm`

  `npm i servicecontainer --save`

# Usage

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
    
    let container = ServiceContainer.create(__dirname+'/Config/Services.json');
    
    container.get('helloService').sayHello();
    
    console.log("Parameter : "+container.getParameter('name'));
    
# API

[API Doc](docs/index.html)