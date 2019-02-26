import images = require('images');
import fs = require('fs');
import path = require('path');
import { IPackData as IPackData, ITrimData, IParser } from './core/IParser';
import { ParserFactory } from './core/ParserFactory';
import { parserCfg } from './config/parserCfg';

export class Main {

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

        parser.parse(filePath, this.trim);
    }



    trim(packData: IPackData) {
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

export function unpack() {
    let argv = process.argv.slice(2);
    if (argv.length < 2) {
        help();
        return;
    }
    new Main(argv[0], argv[1]);
}

function help() {
    console.log(`you have to provide 2 arguments, the first arg is director or file,
    and the second arg is packType.\ncommand like:\nun dir cc \nun file.plist cc`)

}