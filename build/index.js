(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "images", "fs", "path", "./core/ParserFactory", "./config/parserCfg"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const images = require("images");
    const fs = require("fs");
    const path = require("path");
    const ParserFactory_1 = require("./core/ParserFactory");
    const parserCfg_1 = require("./config/parserCfg");
    class Main {
        constructor(a, b) {
            this.parseDir(a, b);
        }
        parseDir(dir, parserType) {
            let { ext } = parserCfg_1.parserCfg[parserType];
            let parser = ParserFactory_1.ParserFactory.getParser(parserType);
            fs.readdir(dir, (err, files) => {
                if (err)
                    throw err;
                files.forEach((filename) => {
                    if (filename.match(ext)) {
                        this.parseFile(path.join(dir, filename), parser);
                    }
                });
            });
        }
        parseFile(filePath, parserTypeOrIParser) {
            let parser;
            if (typeof parserTypeOrIParser === "string")
                parser = ParserFactory_1.ParserFactory.getParser(parserTypeOrIParser);
            else
                parser = parserTypeOrIParser;
            parser.parse(filePath, this.trimImg);
        }
        trimImg(packData) {
            let atlasPath = packData.atlasPath;
            let dir = atlasPath.substring(0, atlasPath.lastIndexOf('.'));
            if (!fs.existsSync(dir))
                fs.mkdirSync(dir);
            let atlas = images(atlasPath);
            let item, sImg;
            for (let i = 0; i < packData.trimDatas.length; i++) {
                item = packData.trimDatas[i];
                let arr = item.frame;
                let img = images(atlas, arr[0], arr[1], arr[2], arr[3]);
                if (item.rotated)
                    img.rotate(item.degree);
                if (item.sourceColorRect[2] != item.sourceSize[0] || item.sourceColorRect[3] != item.sourceSize[1]) {
                    sImg = images(item.sourceSize[0], item.sourceSize[1]);
                    sImg.draw(img, item.sourceColorRect[0], item.sourceColorRect[1]);
                }
                else {
                    sImg = img;
                }
                sImg.save(path.join(dir, item.name));
            }
            console.log(`ok!! unpack:${atlasPath}`);
        }
    }
    exports.Main = Main;
    new Main("/Users/xqq/mine/nodejs/workspace/unpack_texturepacker/test/ui", "cc");
});
//# sourceMappingURL=main.js.map


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
});
//# sourceMappingURL=IParser.js.map


(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../config/parserCfg"], factory);
    }
})(function (require, exports) {
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
});
//# sourceMappingURL=ParserFactory.js.map


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


(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../core/utils", "xml2js", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const utils_1 = require("../core/utils");
    const xml2js = require("xml2js");
    const fs = require("fs");
    class CocosParser {
        parse(plistFile, callback) {
            fs.readFile(plistFile, "utf-8", (err, data) => {
                if (err) {
                    console.error(err);
                    console.error(`targetFile:${plistFile}`);
                    return;
                }
                let plistData = { atlasPath: "", trimDatas: [] };
                let path = plistFile.replace(".plist", "");
                plistData.atlasPath = `${path}.png`;
                xml2js.parseString(data, { explicitArray: false }, (err, json) => {
                    if (err) {
                        console.error(err);
                        console.error(`targetFile:${plistFile}`);
                        return;
                    }
                    let content = json.plist.dict.dict[0];
                    let frames = content.dict;
                    let names = content.key;
                    let n, item, arr, s, frame, key;
                    for (let i = 0; i < names.length; i++) {
                        plistData.trimDatas[i] = item = { name: names[i], rotated: false, degree: 0, frame: null, sourceColorRect: null, sourceSize: null };
                        let frame = frames[i];
                        let keys = frame.key;
                        let strings = frame.string;
                        n = 0;
                        for (let j = 0; j < keys.length; j++) {
                            key = keys[j];
                            if (key == "rotated") {
                                item.rotated = frame.true != undefined;
                                item.degree = 270;
                                continue;
                            }
                            s = strings[n];
                            arr = s.replace(/\{|\}/g, "").split(",");
                            switch (key) {
                                case "frame":
                                    utils_1.Utils.strArr2NumArr(arr);
                                    item.frame = arr;
                                    break;
                                case "offset":
                                    break;
                                case "sourceColorRect":
                                    utils_1.Utils.strArr2NumArr(arr);
                                    item.sourceColorRect = arr;
                                    break;
                                case "sourceSize":
                                    utils_1.Utils.strArr2NumArr(arr);
                                    item.sourceSize = arr;
                                    break;
                            }
                            ++n;
                        }
                        if (item.rotated) {
                            item.frame[2] = item.frame[2] ^ item.frame[3];
                            item.frame[3] = item.frame[2] ^ item.frame[3];
                            item.frame[2] = item.frame[2] ^ item.frame[3];
                        }
                    }
                    callback.call(this, plistData);
                });
            });
        }
    }
    exports.CocosParser = CocosParser;
});
//# sourceMappingURL=CocosParser.js.map


