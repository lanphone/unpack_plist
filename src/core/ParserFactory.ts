import { IParser } from "./IParser";
import { parserCfg } from "../config/parserCfg";

export class ParserFactory {

    static getParser(type: string): IParser {
        let p = parserCfg[type];
        if (!p)
            throw new Error(`has not this parser:${type}`);

        let cls = p.parser;
        return new cls();
    }
}