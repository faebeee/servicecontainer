import path from "path";

import {Definition} from '../Definition';

class Container {
    services: Object = {};
    definitions: Object = {};
    parameters : Object = {};
    additionalParameters : Object = {};

    serviceConfiguration: string = null;
    rootDir: string = null;

    constructor(serviceConfiguration: string, additionalParameters: Object = {}){
        this.serviceConfiguration = serviceConfiguration;
        this.rootDir = path.dirname(serviceConfiguration);
        this.additionalParameters = additionalParameters;

        this._load();
        this._loadDefaultParameters();
    }

    _load(){
        let loader = new Loader(this.serviceConfiguration);
        loader.load(require(this.serviceConfiguration), this):
        this._addService('container', this);
    }

    _loadDefaultParameters(){
        this._addParameters(this.additionalParameters);
    }

    _addOarameters(parameters: Object = {}) {
        this.parameters = Object.assign({}, this.parameters, parameters);
    }

    _addDefinition(name: String, definition: Definition){
        if(definition.file == null){
            throw new Error(`File not defined for service ${name}`);
        }
        definition.class = this._loadModuleClassDefinition(definition);
        this.definitions[name] = definition;
    }

    _loadModuleClassDefiniton(def: Definition){
        if(def.file === null){
            return;
        }
        
    }
}