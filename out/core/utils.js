(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Utils {
        static strArr2NumArr(arr) {
            for (let i = 0; i < arr.length; i++)
                arr[i] = Number(arr[i]);
        }
    }
    exports.Utils = Utils;
});
//# sourceMappingURL=utils.js.map