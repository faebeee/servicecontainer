import {dirname} from "path";

import Definition from "../Definition";
import Loader from "../Loader";
import {getParameterReferenceName, getServiceReference, isParameterReference, isServiceReference} from "../Utils";
import NamedDefinitions from "../Interfaces/NamedDefinitions";
import NamedServices from "../Interfaces/NamedServices";
import Parameters from "../Interfaces/Parameters";

/**
 * @class
 */
export default class Container {
    services: NamedServices = {};
    definitions: NamedDefinitions = {};
    parameters: Parameters = {};
    additionalParameters: Object = {};

    serviceConfigurationFile: string;
    rootDir: string;

    constructor(
        serviceConfigurationFile: string,
        additionalParameters: Object = {}
    ) {
        this.serviceConfigurationFile = serviceConfigurationFile;
        this.rootDir = dirname(serviceConfigurationFile);
        this.additionalParameters = additionalParameters;

        this._load();
        this._loadDefaultParameters();
    }

    /**
     * Load the data into the container
     *
     * @memberof Container
     */
    _load(): void {
        let loader = new Loader(this.serviceConfigurationFile);
        loader.load(require(this.serviceConfigurationFile), this);
        this._addService("container", this);
    }

    /**
     * Set default parameters
     *
     * @memberof Container
     */
    _loadDefaultParameters(): void {
        this.addParameters(this.additionalParameters);
    }

    /**
     * Register new service definition
     *
     * @param {String} name
     * @param {Definition} definition
     * @memberof Container
     */
    _addDefinition(name: string, definition: Definition): void {
        if (definition.file == null) {
            throw new Error(`File not defined for service ${name}`);
        }
        definition.class = this._loadModuleClassDefinition(definition);
        this.definitions[name] = definition;
    }

    /**
     * Load the source for the module
     *
     * @param {Definition} def
     * @returns {Object}
     * @memberof Container
     */
    _loadModuleClassDefinition(def: Definition): Object | null {
        if (def.file === null) {
            return null;
        }

        let classFile = null;
        if (isParameterReference(def.file)) {
            classFile = this._fillParameter(def.file);
        } else {
            classFile = def.file;
        }
        if (!classFile) {
            throw new Error("No file in configuration");
        }

        const classFileDef = require(classFile);
        if (classFileDef.default) {
            return classFileDef.default;
        }
        return classFileDef;
    }

    /**
     * Get definition by name
     *
     * @param {string} name
     * @returns {Definition}
     * @memberof Container
     */
    _getDefinitionByName(name: string): Definition | null {
        if (
            this.definitions[name] === undefined ||
            this.definitions[name] === null
        ) {
            return null;
        }
        return this.definitions[name];
    }

    /**
     * Get service by a name
     *
     * @param {string} name
     * @returns {(Object|null)}
     * @memberof Container
     */
    _getServiceByName(name: string): Object | null {
        if (this.services[name] === null || this.services[name] === undefined) {
            return null;
        }

        return this.services[name];
    }

    /**
     * Add service to the contianer
     *
     * @param {string} name
     * @param {Object} service
     * @memberof Container
     */
    _addService(name: string, service: Object): void {
        this.services[name] = service;
    }

    /**
     *
     *
     * @param {Array<string>} args
     * @returns {Array<any>}
     * @memberof Container
     */
    _constructArguments(args: Array<string>): Array<any> {
        let _args = [];

        for (let i = 0; i < args.length; i++) {
            _args.push(this._constructArgument(args[i]));
        }

        return _args;
    }

    /**
     * Check if parameter consists of multiple references like `%app.name%/%env.dir%/%path.to.whatever%`
     *
     * @param {string} parameter
     * @returns {string}
     * @memberof Container
     */
    _fillParameter(parameter: string): string {
        let references = parameter.match(/(%[a-zA-Z-_\.]*%)/g);
        if (null === references) return parameter;

        for (let i = 0; i < references.length; i++) {
            const ref = references[i];
            const paramName = getParameterReferenceName(ref);
            const value = this.getParameter(paramName);
            parameter = parameter.replace(ref, value);
        }

        return parameter;
    }

    /**
     * Build up the argument that has to be passed to the service constructor
     *
     * @param {string} reference
     * @returns {any}
     * @memberof Container
     */
    _constructArgument(reference: string): any {
        let argument = null;

        if (isParameterReference(reference)) {
            const argParamId = getParameterReferenceName(reference);
            argument = this.getParameter(argParamId);
        } else if (isServiceReference(reference)) {
            const id = getServiceReference(reference);
            const service = this._getServiceByName(id);
            if (service) {
                argument = service;
            } else {
                argument = this._createService(id);
            }
        } else {
            argument = reference;
        }

        return argument;
    }

    /**
     * Access parameter by given path like `app.namespace.app.config`
     *
     * @param {string} name
     * @returns {Boolean|Number|String|Object|null}
     * @memberof Container
     */
    _getRecursiveParameterByName(name: string): any {
        let path = name.split(".");
        let params = this.parameters;
        for (let i = 0; i < path.length; i++) {
            if (params === null) {
                continue;
            }

            if (params[path[i]] !== null && params[path[i]] != undefined) {
                params = params[path[i]];
            } else {
                return null;
            }
        }
        return params;
    }

    /**
     * Instanciate a service if required
     *
     * @param {string} name
     * @returns {Object}
     * @memberof Container
     */
    _createService(name: string): Object {
        const definition = this._getDefinitionByName(name);
        if (!definition) {
            throw new Error(`No definition found for ${name}`);
        }

        const args = this._constructArguments(definition.arguments);
        let serviceClass = definition.class;
        let service = null;

        if (definition.isObject === true) {
            service = serviceClass;
        } else {
            service = new (Function.prototype.bind.apply(serviceClass, [null].concat(args)))();
        }

        this._addService(name, service);
        return service;
    }

    /**
     * Add parameters to the container
     *
     * @param {Object} [parameters={}]
     * @memberof Container
     */
    addParameters(parameters: Object = {}): void {
        this.parameters = Object.assign({}, this.parameters, parameters);
    }

    /**
     * Get parameter
     *
     * @param {string} name
     * @returns {Boolean|Number|String|Object}
     * @memberof Container
     */
    getParameter(name: string): any {
        let parameter = null;
        if ((parameter = this._getRecursiveParameterByName(name)) === null) {
            if (
                this.parameters[name] === undefined
            ) {
                throw new Error("No parameter with name " + name);
            }
            parameter = this.parameters[name];
        }

        if ("string" == typeof parameter) {
            return this._fillParameter(parameter);
        } else {
            return parameter;
        }
    }

    /**
     * Get services by tag
     *
     * @param {string} tag
     * @returns {Array<Object>}
     * @memberof Container
     */
    getServicesByTag<T>(tag: string): Array<T> {
        let keys = Object.keys(this.definitions);
        let len = keys.length;

        let services = [];

        for (let i = 0; i < len; i++) {
            let def = this.definitions[keys[i]];
            let tags = def.tags;
            if (tags.indexOf(tag) !== -1) {
                services.push(this.get(def.name));
            }
        }

        return services;
    }

    /**
     * get a service
     *
     * @param {String} name
     * @returns {Object}
     */
    get<T>(name: string): T {
        const service = <T>this._getServiceByName(name);
        if (service) {
            return service;
        }

        return <T>this._createService(name);
    }
}
