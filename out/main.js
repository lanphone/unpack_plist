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