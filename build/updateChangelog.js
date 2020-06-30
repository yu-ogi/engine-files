const path = require("path");
const fs = require("fs");

console.log("start to update changelog");
const packageJson = require(path.join(__dirname, "..", "package.json"));
const replacedText = `# CHANGELOG

## ${packageJson["version"]}
* @akashic/pdi-types: ${packageJson["dependencies"]["@akashic/pdi-types"]}
* @akashic/akashic-engine: ${packageJson["dependencies"]["@akashic/akashic-engine"]}
* @akashic/game-driver: ${packageJson["dependencies"]["@akashic/game-driver"]}
* @akashic/pdi-browser: ${packageJson["devDependencies"]["@akashic/pdi-browser"]}
* @akashic/playlog-client: ${packageJson["optionalDependencies"]["@akashic/playlog-client"]}`;
const currentChangeLog = fs.readFileSync(path.join(__dirname, "..", "CHANGELOG.md")).toString();
const nextChangeLog = currentChangeLog.replace("# CHANGELOG", replacedText);
fs.writeFileSync(path.join(__dirname, "..", "CHANGELOG.md"), nextChangeLog);
console.log("end to update changelog");
