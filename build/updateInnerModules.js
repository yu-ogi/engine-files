const path = require("path");
const semver = require("semver");
const fs = require("fs");
const sh = require("shelljs");

console.log("start to update akashic-modules");
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = require(packageJsonPath);
const versionsAfterUpdate = {};
const modules = [
	{
		name: "akashic-engine",
		savingType: "dependencies"
	},
	{
		name: "game-driver",
		savingType: "dependencies"
	},
	{
		name: "pdi-browser",
		savingType: "devDependencies"
	},
	{
		name: "playlog-client",
		savingType: "optionalDependencies"
	},
	{
		name: "pdi-types",
		savingType: "dependencies"
	},
	{
		name: "game-configuration",
		savingType: "dependencies"
	}
];

try {
	modules.forEach(function (module) {
		const target = `@akashic/${module.name}@${module.tag || "latest"}`;
		sh.exec(`npm install --save-exact --save-dev ${target}`);
		const infoCmd = sh.exec(`npm info ${target} version --json`);
		const version = JSON.parse(infoCmd);
		versionsAfterUpdate[module.name] = semver.valid(version);
	});

	const updatedModules = modules.filter(function(module) {
		const before = packageJson[module.savingType][`@akashic/${module.name}`];
		const after = versionsAfterUpdate[module.name];
		return before !== after;
	});

	// 内部モジュールに更新がない時はエラーコードを返す
	if (updatedModules.length === 0) {
		console.error("there are no modules to be updated");
		process.exit(1);
	}
	updatedModules.forEach(function(module) {
		packageJson[module.savingType][`@akashic/${module.name}`] = versionsAfterUpdate[module.name];
		console.log(`update @akashic/${module.name} to ${versionsAfterUpdate[module.name]}`);
	});

	packageJson["version"] = semver.inc(semver.valid(packageJson["version"]), "patch");

	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log(`update version to ${packageJson["version"]}. complete to update akashic-modules`);
} catch(err) {
	console.error(err);
	process.exit(1);
}
