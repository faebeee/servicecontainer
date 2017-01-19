'use strict';


module.exports = class Container {

    constructor( classLoader ) {
        this.services = {};
        this.definitions = {};
        this.parameters = {};
        this.classLoader = classLoader;
        this.instanciate = [];
    }

    /**
     * Add parameter to container
     * 
     * @param {String} name
     * @param {any} value
     */
    addParameter(name, value) {
        this.parameters[name] = value;
    }

    /**
     * Add definition to server
     * 
     * @param {String} name
     * @param {Definition} definition
     */
    addDefinition(name, definition) {
        this.classLoader.loadClass(this, definition);
        this.definitions[name] = definition;
    }

    /**
     * Create a new service instance
     *
     * @param {String} name
     * @returns {Object}
     */
    createService( name ) {
        if (this.definitions[name] === undefined || this.definitions[name] === null) {
            throw new Error('No definition for name ' + name);
        }

        if(this.services[name] !== null && this.services[name] !== undefined){
            return this.services[name];
        }

        let def = this.definitions[name];
        let _arguments = this.constructArguments(def.arguments);

        let serviceClass = def.class;
        let service  = null;

        if(def.isObject === true){
            service = serviceClass;
        }else{
            service = new (Function.prototype.bind.apply(serviceClass, [null].concat(_arguments)));
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
    constructArguments (argumentReferences) {
        let _arguments = [];
        for (let i = 0; i < argumentReferences.length; i++) {
            _arguments.push(this.constructArgument(argumentReferences[i]));
        }

        return _arguments;
    }

    /**
     * Get a parameter
     *
     * @param {String} name The name of the parameter
     * @returns {any} The value of the parameter
     */
    getParameter (name) {
        if(this.parameters[name] === null || this.parameters[name] === undefined){
            throw new Error('No parameter with name '+name);
        }

        let parameter = this.parameters[name];

        if ("string" == typeof parameter) {
            return this.fillParameter(parameter);
        } else {
            return this.deepCopyObject(parameter);
        }
    }

     /**
     * Fills a parameter by replacing its letiable palceholders
     *
     * @param {String} parameter The name of the parameter
     * @returns {String} The filled parameter
     */
    fillParameter (parameter) {
        let lets = parameter.match(/(%[a-zA-Z-_\.]*%)/g);
        if (null == lets) return parameter;

        lets.forEach(function (current_let) {
            let let_name = current_let.replace(/%/g, "");
            let value = this.getParameter(let_name);
            parameter = parameter.replace(current_let, value);
        }.bind(this));

        return parameter;
    }

    /**
    * 
    * Transforms the raw argument name to the parameter name
    *
    * @param {String} argumentId
    */    
    getParameterIdFromArgumentReference (argumentId) {
        return argumentId.replace(/%/g, '');
    }

    /**
     * Checks if a given argument is a service or a parameter
     * @param {String} arg
     * @return {Boolean}
     */    
    isArgumentALiteral (arg) {
        if (typeof arg !== 'string') {
            return true;
        } else if (arg.indexOf('@') !== 0 && !(/^%[^%]+%$/.test(arg))) {
            return true;
        } else {
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
    isArgumentAService(argumentId) {
        if (typeof argumentId !== 'string') {
            return false;
        } else {
            return (argumentId.indexOf('@') === 0);
        }
    }

    /**
     *
     * @param {string} argumentId
     * @returns {String}
     */    
    getServiceIdFromArgumentReference(argumentId) {
        let stripped;
        stripped = argumentId.replace(/^@/, '');
        stripped = stripped.replace(/^\?/, '');
        return stripped;
    }

    /**
     * Construct a single argument
     *
     * @param {String} reference
     * @returns {any}
     */
    constructArgument (reference) {
        let id, argParamId, argument;

        if (this.isArgumentALiteral(reference)) {
            argument = reference;


        } else if (this.isArgumentAService(reference)) {
            id = this.getServiceIdFromArgumentReference(reference);

            if (this.services[id]) {
                argument = this.services[id];
            } else {
                argument = this.createService(id);
            }

        } else {
            argParamId = this.getParameterIdFromArgumentReference(reference);
            argument = this.getParameter(argParamId);
        }

        return argument;
    }

    /**
     * get a service
     * 
     * @param {String} name
     * @returns {Object}
     */
    get(name) {
        if (this.services[name] === undefined) {
            this.createService(name);
        }

        return this.services[name];
    }
};