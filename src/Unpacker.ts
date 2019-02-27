import images = require('images');
import fs = require('fs');
import path = require('path');
import { ITrimData, ITrimItemData, IParser } from './core/IParser';
import { ParserFactory } from './core/ParserFactory';
import { parserCfg } from './config/parserCfg';

export class Unpacker {

    constructor(filename: string, packType: string) {
        if (fs.statSync(filename).isDirectory())
            this.parseDir(filename, packType);
        else
            this.parseFile(filename, packType);
    }


    parseDir(dir: string, packType: string) {
        let { ext } = parserCfg[packType];
        let parser: IParser = ParserFactory.getParser(packType);
        fs.readdir(dir, (err, files) => {
            if (err) {
                console.error(err);
            } else {
                files.forEach((filename) => {
                    let filePath = path.join(dir, filename);
                    if (filename.match(ext)) {
                        this.parseFile(filePath, parser);
                    } else if (fs.statSync(filePath).isDirectory()) {
                        this.parseDir(filePath, packType);
                    }
                });
            }
        });
    }

    parseFile(filePath: string, parserTypeOrIParser: string | IParser) {
        let parser: IParser;
        if (typeof parserTypeOrIParser === "string")
            parser = ParserFactory.getParser(parserTypeOrIParser);
        else
            parser = parserTypeOrIParser;

        parser.parse(filePath, (err: Error, trimData: ITrimData) => !err && trimData && this.trim(trimData));

    }



    trim(trimData: ITrimData) {
        let atlasPath = trimData.atlasPath;
        let dir = atlasPath.substring(0, atlasPath.lastIndexOf('.'))
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        let atlas = images(atlasPath);
        let item: ITrimItemData, sImg;
        for (let i = 0; i < trimData.itemDatas.length; i++) {
            item = trimData.itemDatas[i];
            let arr = item.frame;
            let img = images(atlas, arr[0], arr[1], arr[2], arr[3]);

            if (item.rotated)
                img.rotate(item.degree);

            if (item.sourceColorRect[2] != item.sourceSize[0] || item.sourceColorRect[3] != item.sourceSize[1]) {
                sImg = images(item.sourceSize[0], item.sourceSize[1]);
                sImg.draw(img, item.sourceColorRect[0], item.sourceColorRect[1]);
            } else {
                sImg = img;
            }
            sImg.save(path.join(dir, item.name));
        }
        console.log(`ok!! unpack:${atlasPath}`);
    }
}

export function unpack(filename: string, packType: string) {
    new Unpacker(filename, packType);
}

//-------check binding.node------

var child_process = require('child_process');

(() => {
    if (!fs.existsSync(path.resolve("node_modules", "images", "build"))) {
        child_process.spawn('cp', ['-r', path.resolve("build"), path.resolve("node_modules", "images")]);
        console.log("has copied binding.node to node_modules/images! if run error, please upgrade nodejs to lastest!")
    }
})()
