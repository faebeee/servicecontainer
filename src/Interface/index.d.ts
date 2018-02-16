/**
 *
 * @export
 * @interface ConfigInterface
 */
export interface ConfigInterface {
    services: Object;
    parameters: Object;
    imports: Object;
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
    isObject: Boolean;
    tags: Array<string>;
}
