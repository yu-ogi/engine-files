const path = require("path");
const semver = require("semver");
const npm = require("npm");
const fs = require("fs");

console.log("start to update akashic-modules");
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = require(packageJsonPath);
const versionsAfterUpdate = {};
// 本来akashic-pdiは不要だが、TypeScript が出力する JS に依存が(不必要に)残ってしまっているので、ないとビルド時にエラーで落ちてしまう
const modules = [
	{name: "akashic-engine", version: 1, scope: "@akashic", savingType: "dependencies"},
	{name: "game-driver", version: 0, scope: "@akashic", savingType: "dependencies"},
	{name: "pdi-browser", version: 0, scope: "@akashic", savingType: "devDependencies"},
	{name: "playlog-client", version: "latest", scope: "@akashic", savingType: "optionalDependencies"},
	{name: "akashic-pdi", version: 1, scope: "@akashic", savingType: "dependencies"}
];
// インストールしてはいけないバージョンを対象モジュール名をキーにして記述する。
// ここに記述するものは、上げるべきではないのに誤ってマイナーバージョンを新しく上げてしまった上記modulesに該当するモジュールのみ。
// ここに記載されているバージョンが最新のバージョンの場合、この1つ下のバージョンがインストールされる。
// 古いものはインストールされる恐れが無いため書き残しておく必要はない。そのため、各モジュールに対応するblackListなバージョンは1つあれば十分。
const blackList = {
	"akashic-engine": "1.13.0" // https://github.com/akashic-games/akashic-engine/releases/tag/v1.13.0
};
const promises = modules.map(function(module){
	return new Promise(function(resolve, reject) {
		npm.load({"save-dev": true, "save-exact": true}, function(err) {
			if (err) {
				reject(err);
				return;
			}
			npm.info(`${module.scope}/${module.name}@${module.version}`, "version", function(err, versionInfo) {
				if (err) {
					reject(err);
					return;
				}
				const versions = Object.keys(versionInfo);
				versionsAfterUpdate[module.name] = semver.valid(versions[versions.length - 1]);
				var lessStr = "";
				if (blackList[module.name] && blackList[module.name] === versionsAfterUpdate[module.name]) {
					lessStr = "<";
				}
				const installedPackage = `${module.scope}/${module.name}@${lessStr}${versionsAfterUpdate[module.name]}`;
				console.log(`npm install ${installedPackage} \n`);
				npm.install(installedPackage, function(err) {
					if (err) {
						reject(err);
						return;
					}
					resolve();
				});
			});
		});
	}).catch(function(err) {
		console.error(err);
		process.exit(1);
	});
});

Promise.all(promises).then(function() {
	const updatedModules = modules.filter(function(module) {
		const before = packageJson[module.savingType][`${module.scope}/${module.name}`];
		const after = versionsAfterUpdate[module.name];
		return before !== after;
	});

	// 内部モジュールに更新がない時はエラーコードを返す
	if (updatedModules.length === 0) {
		console.error("there are no modules to be updated");
		process.exit(1);
	}
	updatedModules.forEach(function(module){
		packageJson[module.savingType][`${module.scope}/${module.name}`] = versionsAfterUpdate[module.name];
		console.log(`update ${module.scope}/${module.name} to ${versionsAfterUpdate[module.name]}`);
	});
	packageJson["version"] = semver.inc(semver.valid(packageJson["version"]), 'patch');
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log(`update version to ${packageJson["version"]}. complete to update akashic-modules`);
}).catch(function(err) {
	console.error(err);
	process.exit(1);
});
