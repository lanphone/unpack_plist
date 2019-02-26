"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const images = require("images");
const fs = require("fs");
const path = require("path");
const ParserFactory_1 = require("./core/ParserFactory");
const parserCfg_1 = require("./config/parserCfg");
class Unpacker {
    constructor(filename, packType) {
        if (fs.statSync(filename).isDirectory())
            this.parseDir(filename, packType);
        else
            this.parseFile(filename, packType);
    }
    parseDir(dir, packType) {
        let { ext } = parserCfg_1.parserCfg[packType];
        let parser = ParserFactory_1.ParserFactory.getParser(packType);
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error(err);
            }
            else {
                files.forEach((filename) => {
                    let filePath = path.join(dir, filename);
                    if (filename.match(ext)) {
                        this.parseFile(filePath, parser);
                    }
                    else if (fs.statSync(filePath).isDirectory()) {
                        this.parseDir(filePath, packType);
                    }
                });
            }
        });
    }
    parseFile(filePath, parserTypeOrIParser) {
        let parser;
        if (typeof parserTypeOrIParser === "string")
            parser = ParserFactory_1.ParserFactory.getParser(parserTypeOrIParser);
        else
            parser = parserTypeOrIParser;
        parser.parse(filePath, this.trim);
    }
    trim(packData) {
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
exports.Unpacker = Unpacker;
//# sourceMappingURL=Unpacker.js.map