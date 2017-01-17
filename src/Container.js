'use strict';

let ClassLoader = require('./ClassLoader');

module.exports = class Container {

    constructor() {
        this.services = {};
        this.definitions = {};
        this.parameters = {};
        this.classLoader = new ClassLoader();
    }    

    /**
     * Add parameter to container
     * 
     * @param {String} name
     * @param {any} value
     */
    _addParameter(name, value) {
        this.parameters[name] = value;
    }

    /**
     * Split name
     * @param {string} name
     * @returns {Array|*}
     */
    _prepareNamePath(name) {
        let path = name.split('.');
        return path;
    }

    /**
     * Add definition to server
     * 
     * @param {String} name
     * @param {Definition} definition
     */
    _addDefinition(name, definition) {
        this.classLoader.loadClass(this, definition);
        this.definitions[name] = definition;
    }

     /**
     * Fills a parameter by replacing its variable palceholders
     *
     * @param {String} parameter The name of the parameter
     * @returns {String} The filled parameter
     */
    _fillParameter (parameter) {
        let vars = parameter.match(/(%[a-zA-Z-_\.]*%)/g);
        if (null == vars) return parameter;

        vars.forEach((current_var) => {
            let var_name = current_var.replace(/%/g, "");
            let value = this.getParameter(var_name);
            parameter = parameter.replace(current_var, value);
        });

        return parameter;
    }

    /**
    * 
    * Transforms the raw argument name to the parameter name
    *
    * @param {String} argumentId
    */    
    _getParameterIdFromArgumentReference (argumentId) {
        return argumentId.replace(/%/g, '');
    }

    /**
     * Checks if a given argument is a service or a parameter
     *
     * @param {String} arg
     * @return {Boolean}
     */    
    _isArgumentALiteral (arg) {
        if (typeof arg !== 'string'){
            return true;
        }else if (arg.indexOf('@') !== 0 && !(/^%[^%]+%$/.test(arg))){
            return true;
        }else{
            return false;
        }
    }
    
    /**
     * Check if it's a service
     * 
     * @param {String} argumentId
     * @returns {Boolean}
     * 
     * @memberOf Container
     */
    _isArgumentAService(argumentId) {
        if (typeof argumentId !== 'string') {
            return false;
        } else {
            return (argumentId.indexOf('@') === 0);
        }
    }

    /**
     * Create a new service instance
     * 
     * @param {String} name
     * @returns {Object}
     */
    _createService(name ) {
        if (this.definitions[name] === undefined || this.definitions[name] === null) {
            throw new Error('No definition for name ' + name);
        }

        if(this.services[name] !== null && this.services[name] !== undefined){
            return this.services[name];
        }

        let def = this.definitions[name];
        let _arguments = this._constructArguments(def.arguments);
    
        let serviceClass = def.class;
        let service  = null;
        
        if(def.isObject === false){
            service = new (Function.prototype.bind.apply(serviceClass, [null].concat(_arguments)));
        }else{
            service = serviceClass;
        }

        this.services[name] = service;

        return service;
    }

    /**
     * Construct the arguments as either services or parameters
     *
     * @param {Array} argumentReferences
     * @returns {Array} An array of constructed arguments and parameters
     */    
    _constructArguments (argumentReferences) {
        let _arguments = [];

        for (let i = 0; i < argumentReferences.length; i++) {
            _arguments.push(this._constructArgument(argumentReferences[i]));
        }

        return _arguments;
    }

    /**
     * Construct a single argument
     *
     * @param {string} reference
     * @returns {undefined}
     */
    _constructArgument (reference) {
        let id, argSvcTree, argIsOptional, argParamId, argument;

        if (this._isArgumentALiteral(reference)) {
            argument = reference;


        } else if (this._isArgumentAService(reference)) {
            id = this._getServiceIdFromArgumentReference(reference);

            if (this.services[id]) {
                argument = this.services[id];
            } else {
                argument = this._createService(id);
            }

        } else {
            argParamId = this._getParameterIdFromArgumentReference(reference);
            argument = this.getParameter(argParamId, ns);
        }

        return argument;
    }

    /**
     * Get service id from reference
     *
     * @param {string} argumentId
     * @returns {String}
     */    
    _getServiceIdFromArgumentReference(argumentId) {
        var stripped;
        stripped = argumentId.replace(/^@/, '');
        stripped = stripped.replace(/^\?/, '');
        return stripped;
    }

    /**
     * Get tagged services
     * @param {String} tagname
     * @returns {Object[]} tagged services
     */
    getServicesByTag(tagName) {
        let keys = Object.keys(this.definitions);
        let len = keys.length;
        
        let services = [];

        for (let i = 0; i < len; i++){
            
            let key = keys[i];
            let definition = this.definitions[key]; 
            if (definition.tags.length > 0) {
                let tags = definition.tags;
                if (tags.indexOf(tagName) !== -1) {
                    services.push(this.get(definition.name));
                }
            }
        }

        return services;
    }
    
    /**
     * Get a parameter
     *
     * @param {String} name The name of the parameter
     * @returns {any} The value of the parameter
     */
    getParameter(name) {

        if (this.parameters[name] !== null && this.parameters[name] !== undefined) {
            return this.parameters[name];
        }

        name = this._prepareNamePath(name);

        let parameter = this.parameters;
        for (let i = 0; i < name.length; i++){
            let key = name[i];

            if(parameter[key] === null || parameter[key] === undefined){
                throw new Error('No parameter with name '+key);
            }

            parameter = parameter[key];
        }

        if ("string" == typeof parameter) {
            return this._fillParameter(parameter);
        } else {
            return JSON.parse(JSON.stringify(parameter));;
        }
    }

    /**
     * get a service
     * 
     * @param {String} name
     * @returns {Object}
     */
    get(name) {
        if (this.services[name] === undefined) {
            this._createService(name);
        }

        return this.services[name];
    }
};