const path = require("path");
const sh = require("shelljs");
const fs = require("fs");

console.log("start to build files");
function build(inputFileName, outputFileName, inputDir, outputDir) {
	const browserify = path.join(__dirname, "..", "node_modules", ".bin", "browserify");
	const uglifyjs = path.join(__dirname, "..", "node_modules", ".bin", "uglifyjs");
	sh.exec(`${browserify} ${path.join(inputDir, inputFileName)} -s ${path.basename(outputFileName, ".js")} | ${uglifyjs} --comments -o ${path.join(outputDir, outputFileName)}`);
}
function buildEngineFiles(version, inputDir, outputDir) {
	build(
		"engineFiles.js",
		`engineFilesV${version}.js`,
		inputDir,
		outputDir
	);
	console.log("build engine-files");
}
function buildPlayLogClient(version, inputDir, outputDir) {
	if (!fs.existsSync(path.join(__dirname, "..", "node_modules", "@akashic", "playlog-client"))) {
		console.log("playlog-client-file does not exist, so skip to build playlog-client.");
		return;
	}
	build(
		"playlogClient.js",
		`playlogClientV${version}.js`,
		inputDir,
		outputDir
	);
	console.log("build playlog-client");
}
const packageJson = require(path.join(__dirname, "..", "package.json"));
const inputDir = path.join(__dirname, "..", "src");
const outputDir = path.join(__dirname, "..", "dist", "raw", "client");
sh.mkdir("-p", outputDir);
buildEngineFiles(
	(packageJson["version"]).replace(/[\.-]/g, "_"),
	inputDir,
	outputDir
);
buildPlayLogClient(
	(packageJson["optionalDependencies"]["@akashic/playlog-client"]).replace(/[\.-]/g, "_"),
	inputDir,
	outputDir
);
console.log("complete to build files");
