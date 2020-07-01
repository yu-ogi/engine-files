const path = require("path");
const fs = require("fs");

console.log("start to update changelog");
const packageJson = require(path.join(__dirname, "..", "package.json"));
const akashicModules = {};
["dependencies", "devDependencies", "optionalDependencies"].forEach((item) => {
	for (let libName in (packageJson[item] || {})) {
		if (!/^@akashic\//.test(libName)) {
			continue;
		}
		akashicModules[libName] = packageJson[item][libName];
	}
});
let replacedText = `# CHANGELOG

## ${packageJson["version"]}`;
Object.keys(akashicModules).forEach(name => {
	replacedText += `\n* ${name}: ${akashicModules[name]}`;
});
const currentChangeLog = fs.readFileSync(path.join(__dirname, "..", "CHANGELOG.md")).toString();
const nextChangeLog = currentChangeLog.replace("# CHANGELOG", replacedText);
fs.writeFileSync(path.join(__dirname, "..", "CHANGELOG.md"), nextChangeLog);
console.log("end to update changelog");
