const fs       = require("fs");
const path     = require("path").resolve();
const sass     = require("node-sass");
const chokidar = require('chokidar');
const zlib     = require('zlib');


//CSS inline license
const info = process.env;
const year = new Date().getFullYear();

license  = "";
license += "/*!\n";
license += " * " + info.npm_package_name + " v" + info.npm_package_version + "\n";
license += " * " + info.npm_package_homepage + "\n";
license += " * \n";
license += " * Copyright (c) " + year + " " + info.npm_package_author_name + "\n";
license += " * Licensed under the " + info.npm_package_license + " license\n";
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