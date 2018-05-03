'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Container_1 = __importDefault(require("./Container"));
let container = null;
/**
 * Construct a Builder object
 * @module
 */
exports.default = {
    /**
     * Build a new container
     *
     * @param {String} file
     * @returns {Container}
     */
    create(file, parameters = {}) {
        if (!container) {
            container = new Container_1.default(file, parameters);
        }
        return container;
    },
    /**
     * Get created container
     *
     * @returns {Container}
     */
    get() {
        return container;
    },
    /**
     * Destroy current container
     */
    destroy() {
        container = null;
    }
};
//# sourceMappingURL=index.js.map