"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const images = require("images");
const fs = require("fs");
const path = require("path");
const ParserFactory_1 = require("./core/ParserFactory");
const parserCfg_1 = require("./config/parserCfg");
class Unpacker {
    constructor(fileOrDir, packType) {
        if (fs.statSync(fileOrDir).isDirectory())
            this.parseDir(fileOrDir, packType);
        else
            this.parseFile(fileOrDir, packType);
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
        return __awaiter(this, void 0, void 0, function* () {
            let parser;
            if (typeof parserTypeOrIParser === "string")
                parser = ParserFactory_1.ParserFactory.getParser(parserTypeOrIParser);
            else
                parser = parserTypeOrIParser;
            try {
                let data = yield parser.parse(filePath);
                this.trim(data);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    trim(trimData) {
        let atlasPath = trimData.atlasPath;
        let dir = atlasPath.substring(0, atlasPath.lastIndexOf('.'));
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        let atlas = images(atlasPath);
        let item, sImg;
        for (let i = 0; i < trimData.itemDatas.length; i++) {
            item = trimData.itemDatas[i];
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
//---------------------
/**
 * 解包图集，裁剪还原小图片
 * @param fileOrDir 配置文件绝对路径或文件目录（允许目录嵌套），支持批量处理
 * @param packType 文件类型，非文件后缀，仅提供了cocos支持，类型为 "cc"，可通过实现 IParser 接口扩展更多类型
 */
function unpack(fileOrDir, packType) {
    new Unpacker(fileOrDir, packType);
}
exports.unpack = unpack;
/**
 * 注册自定义解析器
 * @param type string类型
 * @param parserCls 实现了IParser接口的类
 * @param ext 文件扩展名 (".plist")
 */
function registerParser(type, parserCls, ext) {
    parserCfg_1.parserCfg[type] = { parser: parserCls, ext: ext };
}
exports.registerParser = registerParser;
//-------check binding.node------
var child_process = require('child_process');
(() => {
    if (!fs.existsSync(path.resolve("node_modules", "images", "build"))) {
        let dest = path.resolve("node_modules", "images");
        child_process.spawn('cp', ['-r', path.resolve("build"), dest]);
        console.log(`has copied binding.node to ${path.resolve(dest, 'build')}! if run error, please upgrade nodejs to lastest!`);
    }
})();
//# sourceMappingURL=Unpacker.js.map