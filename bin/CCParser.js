"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./core/utils");
const xml2js = require("xml2js");
const fs = require("fs");
class CCParser {
    parse(configFilePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(configFilePath, "utf-8", (err, data) => {
                if (err) {
                    console.error(`errorFile:${configFilePath}`);
                    reject(err);
                    return;
                }
                let plistData = { atlasPath: "", itemDatas: [] };
                let path = configFilePath.replace(".plist", "");
                plistData.atlasPath = `${path}.png`;
                xml2js.parseString(data, { explicitArray: false }, (err, json) => {
                    if (err) {
                        console.error(`errorFile:${configFilePath}`);
                        reject(err);
                        return;
                    }
                    let content = json.plist.dict.dict[0];
                    let frames = content.dict;
                    let names = content.key;
                    let n, item, arr, s, frame, key;
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
                    resolve(plistData);
                });
            });
        });
    }
}
exports.CCParser = CCParser;
//# sourceMappingURL=CCParser.js.map