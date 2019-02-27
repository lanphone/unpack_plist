import { unpack } from "./Unpacker";

(() => {
    let argv = process.argv.slice(2);
    if (argv.length < 2) {
        help();
        return;
    }
    unpack(argv[0], argv[1]);
})()

function help() {
    console.log(`you have to provide 2 arguments, the first arg is director or file,
and the second arg is packType(exp:cocos type is cc).\n command line like:\n un dir cc \n un file.plist cc`);
}
