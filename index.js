const fs = require("fs");

const ignoredFiles = [
  "index.js",
  "config.json",
  "package.json",
  "README.md",
  "yarn.lock",
];
let i = 0;
fs.readdirSync("./").map((elem) => {
  if (elem.split(".")[1] == "js" && !ignoredFiles.includes(elem))
    console.log(i++);
  if (elem.split(".")[1] == "json" && !ignoredFiles.includes(elem))
    console.log(elem);
});
