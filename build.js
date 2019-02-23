const fs = require('fs');
const path = require('path');

let content = "";
read(path.resolve("out"))
function read(dir) {
    fs.readdir(dir, function (err, fileList) {
        let arr = [];
        fileList.forEach((filename) => {
            let filePath = path.resolve(dir, filename);
            let stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                read(filePath);
            } else {
                if (path.extname(filename) == ".js") {
                    console.log(filePath);
                    var c = fs.readFileSync(filePath);
                    content += c + "\n\n\n";
                }
            }
        });       
        fs.writeFileSync('./build/index.js', content)
    });
}