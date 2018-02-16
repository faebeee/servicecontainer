"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Definition_1 = require("../Definition");
const path_1 = require("path");
/**
 * @class
 */
class Loader {
    /**
     *
     * @param {String} servicesConfigurationFile
     */
    constructor(servicesConfigurationFile) {
        this.servicesConfigurationFile = servicesConfigurationFile;
        this.configDir = path_1.dirname(servicesConfigurationFile);
    }
    /**
     * Load configuration data
     *
     * @param {Object} data
     * @param {Container} container
     * @param {String} folder
     */
    load(data, container, folder) {
        if (data === null || data === undefined) {
            return;
        }
        folder = folder || this.configDir;
        this.loadImport(data, container, folder);
        this.loadParameters(data, container);
        this.loadServices(data, container, folder);
    }
    /**
     * Load services from file
     *
     * @param {ConfigInterface} data
     * @param {Container} container
     */
    loadServices(data, container, folder) {
        if (data.services === undefined ||
            data.services === null ||
            Object.keys(data.services).length <= 0) {
            return;
        }
        let services = data.services;
        let keys = Object.keys(services);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = services[key];
            if (value.file === undefined ||
                value.file === null ||
                value.file.length <= 0) {
                throw new Error(`No file reference for ${key}`);
            }
            value.file = path_1.resolve(folder, value.file);
            container._addDefinition(key, this.createServiceDefinition(key, value));
        }
    }
    /**
     * Create service definition
     *
     * @param {string} name
     * @param {Object} serviceConf
     * @returns {Definition}
     */
    createServiceDefinition(name, serviceConf) {
        let def = new Definition_1.default();
        def.name = name;
        def.file = serviceConf.file || null;
        def.arguments = serviceConf.arguments || [];
        def.isObject = serviceConf.isObject || false;
        def.tags = serviceConf.tags || [];
        return def;
    }
    /**
     * Load parameters from file
     *
     * @param {Object} data
     * @param {Container} container
     */
    loadParameters(data, container) {
        if (data.parameters === undefined || data.parameters === null) {
            return;
        }
        let parameters = data.parameters;
        container.addParameters(parameters);
    }
    /**
     * Load imports
     *
     * @param {Object} data
     * @param {Container} container
     */
    loadImport(data, container, folder) {
        if (data.imports === undefined || data.imports === null) {
            return;
        }
        let imports = data.imports;
        let keys = Object.keys(imports);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = imports[key];
            let importFile = path_1.resolve(folder, value);
            //let importFile = this.rootDir + value.replace('./', '/');
            this.load(require(importFile), container, path_1.dirname(importFile));
        }
    }
}
exports.default = Loader;
//# sourceMappingURL=index.js.map