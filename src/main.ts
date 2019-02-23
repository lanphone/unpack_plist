import images = require('images');
import fs = require('fs');
import path = require('path');
import { IPackData as IPackData, ITrimData, IParser } from './core/IParser';
import { ParserFactory } from './core/ParserFactory';
import { parserCfg } from './config/parserCfg';

export class Main {

    constructor(a, b) {
        this.parseDir(a, b); 

    }


    parseDir(dir: string, parserType: string) {
        let { ext } = parserCfg[parserType];
        let parser: IParser = ParserFactory.getParser(parserType);
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

    parseFile(filePath: string, parserTypeOrIParser: string | IParser) {
        let parser: IParser;
        if (typeof parserTypeOrIParser === "string")
            parser = ParserFactory.getParser(parserTypeOrIParser);
        else
            parser = parserTypeOrIParser;

        parser.parse(filePath, this.trimImg);
    }



    trimImg(packData: IPackData) {
        let atlasPath = packData.atlasPath;
        let dir = atlasPath.substring(0, atlasPath.lastIndexOf('.'))
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        let atlas = images(atlasPath);
        let item: ITrimData, sImg;
        for (let i = 0; i < packData.trimDatas.length; i++) {
            item = packData.trimDatas[i];
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


new Main("/Users/xqq/mine/nodejs/workspace/unpack_texturepacker/test/ui", "cc");
