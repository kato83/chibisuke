const fs       = require("fs");
const path     = require("path").resolve();
const sass     = require("node-sass");
const chokidar = require('chokidar');
const zlib     = require('zlib');
const p        = require("./package.json");

//CSS inline license
const info = process.env;
const year = new Date().getFullYear();

license  = "";
license += "/*!\n";
license += " * " + p.name + " v" + p.version + "\n";
license += " * " + p.homepage + "\n";
license += " * \n";
license += " * Copyright (c) " + year + " " + p.author + "\n";
license += " * Licensed under the " + p.license + " license\n";
license += " */\n\n";


//directory and filename info
const renderFileName = path + "\\dist\\" + "chibisuke";
const sassPath = path + "\\src\\";
const mainFileName = sassPath + "main.scss";

let sassContent = fs.readFileSync(mainFileName, { encoding: "utf-8" });

chokidar.watch(sassPath, { ignored: /[\/\\]\./ }).on('all', (event, path) => {
    setTimeout(() => {
        sassContent = fs.readFileSync(mainFileName, { encoding: "utf-8" });

        //defaultCompile
        sass.render({
            data: sassContent,
            indentType: "tab",
            indentWidth: "1",
            outputStyle: "expanded"
        }, (err, result) => {
            if (!err) {
                fs.writeFileSync(renderFileName + ".css", license + result.css);
            } else {
                if (err) { console.log(err); }
            }
        });

        //minifiedCompile
        sass.render({
            data: sassContent,
            outputStyle: "compressed"
        }, (err, result) => {
            if (!err) {
                fs.writeFileSync(renderFileName + ".min.css", license + result.css);

                //gzip
                zlib.gzip(license + result.css, (err, binary) => {
                    fs.writeFileSync(renderFileName + ".min.css.gz", binary);
                });
            } else {
                if (err) { console.log(err); }
            }
        });

    }, 500);

});