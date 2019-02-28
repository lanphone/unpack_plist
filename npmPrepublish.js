const fs = require('fs');

let gitData = fs.readFileSync("./.gitignore", 'utf-8');
let c = `${gitData}/src/
/test/
/.vscode/
npmPrepublish.js
tsconfig.json`; 

try{
    fs.writeFileSync("./.npmignore", c);
} catch(e){
    console.log(e);
}