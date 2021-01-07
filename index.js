const fs = require("fs");

const ignoredFiles = [
  "index.js",
  "config.json",
  "package.json",
  "README.md",
  "yarn.lock",
];
fs.readdirSync("./").map((elem) => {
  if (elem.split(".")[1] == "js" && !ignoredFiles.includes(elem))
    console.log("!pm2 start " + elem);
  if (elem.split(".")[1] == "json" && !ignoredFiles.includes(elem))
    console.log(elem);
});
