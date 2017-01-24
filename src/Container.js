'use strict';


module.exports = class Container {

    constructor( classLoader ) {
        this.services = {};
        this.definitions = {};
        this.parameters = {};
        this.classLoader = classLoader;
        this.instanciate = [];

        this._loadDefaultParameters()
    }

    /**
     *
     * @private
     */
    _loadDefaultParameters(){
        this._addParameter('app.root', process.cwd());
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
    _constructArguments (argumentReferences) {
        let _arguments = [];
        for (let i = 0; i < argumentReferences.length; i++) {
            _arguments.push(this._constructArgument(argumentReferences[i]));
        }

        return _arguments;
    }



     /**
     * Fills a parameter by replacing its letiable palceholders
     *
     * @param {String} parameter The name of the parameter
     * @returns {String} The filled parameter
     */
    _fillParameter (parameter) {
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
    _getParameterIdFromArgumentReference (argumentId) {
        return argumentId.replace(/%/g, '');
    }

    /**
     * Checks if a given argument is a service or a parameter
     * @param {String} arg
     * @return {Boolean}
     */    
    _isArgumentALiteral (arg) {
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
    _isArgumentAService(argumentId) {
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
    _getServiceIdFromArgumentReference(argumentId) {
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
    _constructArgument (reference) {
        let id, argParamId, argument;

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
            argument = this.getParameter(argParamId);
        }

        return argument;
    }

    /**
     * Create deep copy
     * @param {Object} object
     * @private
     * @returns {Object}
     */
    _deepCopyObject( object ){
        return JSON.parse(JSON.stringify(object));
    }

    /**
     *
     * @param name
     * @return {Array|*}
     * @private
     */
    _getRecursiveParameterByName( name ){
        let path = name.split('.');
        let params = this.parameters;
        for(let i = 0; i < path.length; i++){
            params = params[ path[i] ];
        }
        return params;
    }

    /**
     * Get a parameter
     *
     * @param {String} name The name of the parameter
     * @returns {any} The value of the parameter
     */
    getParameter (name) {

        let parameter = null;
        if((parameter = this._getRecursiveParameterByName(name)) === null){
            if(this.parameters[name] === null || this.parameters[name] === undefined){
                throw new Error('No parameter with name '+name);
            }
            parameter = this.parameters[name];
        }

        if ("string" == typeof parameter) {
            return this._fillParameter(parameter);
        } else {
            return this._deepCopyObject(parameter);
        }
    }

    /**
     *
     * @param tag
     * @returns {Array}
     */
    getServicesByTag( tag ){
        let keys = Object.keys(this.definitions);
        let len = keys.length;

        let services = [];

        for(let i = 0; i < len; i++){
            let def = this.definitions[ keys[ i ] ];
            let tags = def.tags;
            if(tags.indexOf( tag ) !== -1){
                services.push( this.get( def.name ));
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
    get(name) {
        if (this.services[name] === undefined) {
            this._createService(name);
        }

        return this.services[name];
    }
};