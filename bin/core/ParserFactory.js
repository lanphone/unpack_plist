"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parserCfg_1 = require("../config/parserCfg");
class ParserFactory {
    static getParser(type) {
        let p = parserCfg_1.parserCfg[type];
        if (!p)
            throw new Error(`has not this parser:${type}`);
        let cls = p.parser;
        return new cls();
    }
}
exports.ParserFactory = ParserFactory;
//# sourceMappingURL=ParserFactory.js.map