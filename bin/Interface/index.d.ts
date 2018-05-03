/**
 *
 * @export
 * @interface ConfigInterface
 */
export interface ConfigInterface {
    services: NamedServiceConfig;
    parameters: Object;
    imports: string[];
}
export interface NamedServiceConfig {
    [key: string]: ServiceConfigInterface;
}
/**
 *
 *
 * @export
 * @interface ServiceConfigInterface
 */
export interface ServiceConfigInterface {
    file: string;
    arguments: Array<string>;
    isObject: boolean;
    tags: Array<string>;
}
