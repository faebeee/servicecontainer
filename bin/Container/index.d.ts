import Definition from "../Definition";
/**
 * @class
*/
export default class Container {
    services: Object;
    definitions: Object;
    parameters: Object;
    additionalParameters: Object;
    serviceConfigurationFile: string;
    rootDir: string;
    constructor(serviceConfigurationFile: string, additionalParameters?: Object);
    /**
     * Load the data into the container
     *
     * @memberof Container
     */
    _load(): void;
    /**
     * Set default parameters
     *
     * @memberof Container
     */
    _loadDefaultParameters(): void;
    /**
     * Register new service definition
     *
     * @param {String} name
     * @param {Definition} definition
     * @memberof Container
     */
    _addDefinition(name: string, definition: Definition): void;
    /**
     * Load the source for the module
     *
     * @param {Definition} def
     * @returns {Object}
     * @memberof Container
     */
    _loadModuleClassDefinition(def: Definition): Object;
    /**
     * Get definition by name
     *
     * @param {string} name
     * @returns {Definition}
     * @memberof Container
     */
    _getDefinitionByName(name: string): Definition | null;
    /**
     * Get service by a name
     *
     * @param {string} name
     * @returns {(Object|null)}
     * @memberof Container
     */
    _getServiceByName(name: string): Object | null;
    /**
     * Add service to the contianer
     *
     * @param {string} name
     * @param {Object} service
     * @memberof Container
     */
    _addService(name: string, service: Object): void;
    /**
     *
     *
     * @param {Array<string>} args
     * @returns {Array<any>}
     * @memberof Container
     */
    _constructArguments(args: Array<string>): Array<any>;
    /**
     * Check if parameter consists of multiple references like `%app.name%/%env.dir%/%path.to.whatever%`
     *
     * @param {string} parameter
     * @returns {string}
     * @memberof Container
     */
    _fillParameter(parameter: string): string;
    /**
     * Build up the argument that has to be passed to the service constructor
     *
     * @param {string} reference
     * @returns {any}
     * @memberof Container
     */
    _constructArgument(reference: string): any;
    /**
     * Access parameter by given path like `app.namespace.app.config`
     *
     * @param {string} name
     * @returns {Boolean|Number|String|Object}
     * @memberof Container
     */
    _getRecursiveParameterByName(name: string): any;
    /**
     * Instanciate a service if required
     *
     * @param {string} name
     * @returns {Object}
     * @memberof Container
     */
    _createService(name: string): Object;
    /**
     * Add parameters to the container
     *
     * @param {Object} [parameters={}]
     * @memberof Container
     */
    addParameters(parameters?: Object): void;
    /**
     * Get parameter
     *
     * @param {string} name
     * @returns {Boolean|Number|String|Object}
     * @memberof Container
     */
    getParameter(name: string): any;
    /**
     * Get services by tag
     *
     * @param {string} tag
     * @returns {Array<Object>}
     * @memberof Container
     */
    getServicesByTag<T>(tag: string): Array<T>;
    /**
     * get a service
     *
     * @param {String} name
     * @returns {Object}
     */
    get<T>(name: string): T;
}
