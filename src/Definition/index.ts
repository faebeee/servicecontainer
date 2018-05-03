/**
 * @class
 */

export default class Definition {
    name: string;
    file: string | null;
    arguments: Array<string>;
    class: Object | null;
    isObject: Boolean = false;
    tags: Array<string>;

    constructor(name: string, file: string | null, args: Array<string>, isObject: boolean, tags: string[]) {
        this.name = name;
        this.file = file;
        this.arguments = args;
        this.isObject = isObject;
        this.tags = tags;

        this.class = null;
    }
}
