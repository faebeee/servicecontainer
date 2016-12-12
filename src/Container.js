'use strict';

module.exports = class Container {

    constructor() {
        this.services = {};
        this.definitions = {};
        this.parameters = {};
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
    addDefinition( name, definition) {
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
        let classFile = null;

        if (this.isArgumentALiteral(def.file)) {
            classFile = def.file;
        } else {
            classFile = this.getParameter(
                this.getParameterIdFromArgumentReference(def.file)
            );
        }    

        if(!classFile){
            throw new Error('File is not defined in config');
        }

        // Check if the class file path is relative or absolute
        classFile = classFile.replace(/^\.\.\//, './../');
        if (/^\.\//.test(classFile)) {
            // Remove references to the root dir
            classFile = def.rootDir + classFile.replace('./', '/');
        }
        

        //classFile = def.rootDir + classFile.replace('./', '/');
        

        def.class = require(classFile);
        
        let _arguments = this.constructArguments(def.arguments);
    
        let serviceClass = def.class;
        let service = new (Function.prototype.bind.apply(serviceClass, [null].concat(_arguments)));

        this.services[name] = service;

        return service;
    }
    
     /**
     * Construct the arguments as either services or parameters
     *
     * @param {Array} argumentReferences
     * @param {Object} serviceTree A list of previously seen services while building the current service
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

        var parameter = this.parameters[name];

        if ("string" == typeof parameter) {
            return this.fillParameter(parameter);
        } else {
            return this.deepCopyObject(parameter);
        }
    }

     /**
     * Fills a parameter by replacing its variable palceholders
     *
     * @param {String} name The name of the parameter
     * @returns {String} The filled parameter
     */
    fillParameter (parameter) {
        var vars = parameter.match(/(%[a-zA-Z-_\.]*%)/g);
        if (null == vars) return parameter;

        vars.forEach(function (current_var) {
            var var_name = current_var.replace(/%/g, "");
            var value = this.getParameter(var_name);
            parameter = parameter.replace(current_var, value);
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
     * @param {String} argumentId
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
     * Checks if a given argument is an optional service
     * @param {string} argumentId
     * @returns {Boolean} Whether or not it is optional
     */    
    isArgumentOptional(argumentId) {
        return (argumentId.indexOf('@?') !== -1);
    }

    /**
     *
     * @param {string} argumentId
     * @returns {String}
     */    
    getServiceIdFromArgumentReference(argumentId) {
        var stripped;
        stripped = argumentId.replace(/^@/, '');
        stripped = stripped.replace(/^\?/, '');
        return stripped;
    }

    /**
     * Construct a single argument
     *
     * @param {string} reference
     * @param {type} serviceTree
     * @param ns The service namespace
     * @returns {undefined}
     */
    constructArgument (reference, serviceTree, ns) {
        var id, argSvcTree, argIsOptional, argParamId, argument;

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
            argument = this.getParameter(argParamId, ns);
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
}