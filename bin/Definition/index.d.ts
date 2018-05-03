/**
 * @class
 */
export default class Definition {
    name: string;
    file: string | null;
    arguments: Array<string>;
    class: Object | null;
    isObject: Boolean;
    tags: Array<string>;
    constructor(name: string, file: string | null, args: Array<string>, isObject: boolean, tags: string[]);
}
