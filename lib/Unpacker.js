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
const fs = require("fs");
const path = require("path");
//-------check binding.node------
var child_process = require('child_process');
(() => {
    let curPath = path.resolve(__dirname);
    let imagesPath = path.resolve(curPath, "..", "..", "images"); //本地安装
    if (!fs.existsSync(imagesPath)) {
        imagesPath = path.resolve(curPath, "..", "node_modules", "images"); //全局安装
    }
    let imagesBuild = path.resolve(imagesPath, "build");
    if (!fs.existsSync(imagesBuild)) {
        let src = path.resolve(curPath, "binding.node");
        let dest = path.resolve(imagesBuild, "Release");
        try {
            fs.mkdirSync(imagesBuild);
            fs.mkdirSync(dest);
            fs.copyFileSync(src, path.resolve(dest, "binding.node"));
            console.log(`copied binding.node success.
                from ${src} 
                to ${dest}! 
                If run error, please upgrade nodejs to lastest!
            `);
        }
        catch (e) {
            console.log(e);
            console.log(`\n\n warm:copy binding.node faild! you have to copy the file \n ${src} to \n ${dest}\n\n`);
        }
    }
})();
//-------------------
const images = require("images");
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
//# sourceMappingURL=Unpacker.js.map