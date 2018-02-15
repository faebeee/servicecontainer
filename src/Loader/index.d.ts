import Definition from "../Definition";
import Container from "../Container";
import { ConfigInterface, ServiceConfigInterface } from "../Interface";
/**
 * @class
 */
export default class Loader {
    servicesConfigurationFile: string;
    configDir: string;
    /**
     *
     * @param {Object} servicesConfiguration
     */
    constructor(servicesConfigurationFile: string);
    /**
     * Load configuration data
     *
     * @param {Object} data
     * @param {Container} container
     * @param {String} folder
     */
    load(data: ConfigInterface, container: Container, folder?: string): void;
    /**
     * Load services from file
     *
     * @param {ConfigInterface} data
     * @param {Container} container
     */
    loadServices(data: ConfigInterface, container: Container, folder: string): void;
    /**
     * Create service definition
     *
     * @param {string} name
     * @param {Object} serviceConf
     * @returns {Definition}
     */
    createServiceDefinition(name: string, serviceConf: ServiceConfigInterface): Definition;
    /**
     * Load parameters from file
     *
     * @param {Object} data
     * @param {Container} container
     */
    loadParameters(data: ConfigInterface, container: Container): void;
    /**
     * Load imports
     *
     * @param {Object} data
     * @param {Container} container
     */
    loadImport(data: ConfigInterface, container: Container, folder: string): void;
}
