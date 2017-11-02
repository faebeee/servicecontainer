'use strict';

module.exports = class HelloService{
    constructor(name){
        this.name = name;
    }

    sayHello(){
        console.log('Hi '+this.name)
    }
};