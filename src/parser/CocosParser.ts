import { IParser, ITrimData, ITrimItemData } from "../core/IParser";
import { Utils } from "../core/utils";
import xml2js = require('xml2js');
import fs = require('fs');

export class CocosParser implements IParser {

    parse(configFilePath: string): Promise<ITrimData> {
        return new Promise<ITrimData>((resolve, reject) => {
            fs.readFile(configFilePath, "utf-8", (err, data) => {
                if (err) {
                    console.error(`errorFile:${configFilePath}`);
                    reject(err);
                    return;
                }
                let plistData: ITrimData = { atlasPath: "", itemDatas: [] };
                let path = configFilePath.replace(".plist", "");
                plistData.atlasPath = `${path}.png`;

                xml2js.parseString(data, { explicitArray: false }, (err, json) => {
                    if (err) {
                        console.error(`errorFile:${configFilePath}`);
                        reject(err);
                        return;
                    }
                    try {
                        let content = json.plist.dict.dict[0];
                        let frames = content.dict;
                        let names = content.key;
                        let n, item: ITrimItemData, arr, s: string, frame, key;
                        for (let i = 0; i < names.length; i++) {
                            plistData.itemDatas[i] = item = { name: names[i], rotated: false, degree: 0, frame: null, sourceColorRect: null, sourceSize: null };
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
                                        Utils.strArr2NumArr(arr);
                                        item.frame = arr;
                                        break;
                                    case "offset":
                                        break;
                                    case "sourceColorRect":
                                        Utils.strArr2NumArr(arr);
                                        item.sourceColorRect = arr;
                                        break;
                                    case "sourceSize":
                                        Utils.strArr2NumArr(arr);
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
                    } catch (e) {
                        reject(e);
                        return;
                    }
                    resolve(plistData);
                });
            });
        });
    }
}