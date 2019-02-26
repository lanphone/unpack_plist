"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Unpacker_1 = require("./Unpacker");
(() => {
    let argv = process.argv.slice(2);
    if (argv.length < 2) {
        help();
        return;
    }
    new Unpacker_1.Unpacker(argv[0], argv[1]);
})();
function help() {
    console.log(`you have to provide 2 arguments, the first arg is director or file,
and the second arg is packType(exp:cocos type is cc).\ncommand line like:\nun dir cc \nun file.plist cc`);
}
//# sourceMappingURL=index.js.map