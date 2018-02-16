"use strict";
import Definition from "../Definition";
import Container from "../Container";
import { ConfigInterface, ServiceConfigInterface } from "../Interface";

import { dirname, resolve } from "path";

/**
 * @class
 */
export default class Loader {
    servicesConfigurationFile: string;
    configDir: string;

    /**
     *
     * @param {String} servicesConfigurationFile
     */
    constructor(servicesConfigurationFile: string) {
        this.servicesConfigurationFile = servicesConfigurationFile;
        this.configDir = dirname(servicesConfigurationFile);
    }

    /**
     * Load configuration data
     *
     * @param {Object} data
     * @param {Container} container
     * @param {String} folder
     */
    load(data: ConfigInterface, container: Container, folder?: string): void {
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
    loadServices(
        data: ConfigInterface,
        container: Container,
        folder: string
    ): void {
        if (
            data.services === undefined ||
            data.services === null ||
            Object.keys(data.services).length <= 0
        ) {
            return;
        }

        let services = data.services;
        let keys = Object.keys(services);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = services[key];

            if (
                value.file === undefined ||
                value.file === null ||
                value.file.length <= 0
            ) {
                throw new Error(`No file reference for ${key}`);
            }

            value.file = resolve(folder, value.file);
            container._addDefinition(
                key,
                this.createServiceDefinition(key, value)
            );
        }
    }

    /**
     * Create service definition
     *
     * @param {string} name
     * @param {Object} serviceConf
     * @returns {Definition}
     */
    createServiceDefinition(name: string, serviceConf: ServiceConfigInterface) : Definition {
        let def = new Definition();

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
    loadParameters(data: ConfigInterface, container: Container) : void {
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
    loadImport(data: ConfigInterface, container: Container, folder: string): void {
        if (data.imports === undefined || data.imports === null) {
            return;
        }

        let imports = data.imports;
        let keys = Object.keys(imports);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = imports[key];
            let importFile = resolve(folder, value);

            //let importFile = this.rootDir + value.replace('./', '/');
            this.load(require(importFile), container, dirname(importFile));
        }
    }
}
