#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unpacker = require("./Unpacker");
(() => {
    let argv = process.argv.slice(2);
    if (argv.length < 2) {
        help();
        return;
    }
    unpacker.unpack(argv[0], argv[1]);
})();
function help() {
    console.log(`you have to provide 2 arguments, the first arg is director or file,and the second arg is packType(exp:cocos type is cc).
    
    command line like:
      un dir cc 
      un file.plist cc
     `);
}
//# sourceMappingURL=index.js.map