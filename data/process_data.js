const fs = require("fs");

function toCSV(json) {
  json = Object.values(json);
  var csv = "";
  var keys = (json[0] && Object.keys(json[0])) || [];
  csv += keys.join(",") + "\n";
  for (var line of json) {
    csv += keys.map((key) => line[key]).join(",") + "\n";
  }
  return csv;
}

fs.readdirSync("./json").map((jsonFileName, id) => {
  json = fs.readFileSync("./json/" + jsonFileName).toString();
  json = JSON.parse(json);
  json = json.map((val) => ({
    ...val,
    id_category: id + 1,
  }));
  fs.writeFileSync(
    "./json_processed/" + jsonFileName.split(".")[0] + ".json",
    JSON.stringify(json)
  );
});
