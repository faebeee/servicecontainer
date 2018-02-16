/** 
 * @class
*/
export default class Definition {
    name: string;
    file: string;
    arguments: Array<any>;
    class: Object;
    isObject: Boolean = false;
    tags: Array<string>;
}