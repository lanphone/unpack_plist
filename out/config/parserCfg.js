(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../parser/CocosParser"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const CocosParser_1 = require("../parser/CocosParser");
    exports.parserCfg = {
        "cc": { parser: CocosParser_1.CocosParser, ext: ".plist" }
    };
});
//# sourceMappingURL=parserCfg.js.map