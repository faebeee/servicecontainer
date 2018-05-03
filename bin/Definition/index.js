"use strict";
/**
 * @class
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Definition {
    constructor(name, file, args, isObject, tags) {
        this.isObject = false;
        this.name = name;
        this.file = file;
        this.arguments = args;
        this.isObject = isObject;
        this.tags = tags;
        this.class = null;
    }
}
exports.default = Definition;
//# sourceMappingURL=index.js.map