const path = require("path");
const sh = require("shelljs");
const fs = require("fs");

if (process.argv.length < 3) {
	console.error("please enter command as follows: node buildParts.js buildMode");
	console.error("ex: node buildParts.js full");
	process.exit(1);
}
const buildMode = process.argv[2];
if (! /^(full|canvas)$/.test(buildMode)) {
	console.error("please specify one of the following string [full, canvas]");
	process.exit(1);
}

console.log("start to build files");
function build(inputFileName, outputFileName, inputDir, outputDir) {
	const browserify = path.join(__dirname, "..", "node_modules", ".bin", "browserify");
	const uglifyjs = path.join(__dirname, "..", "node_modules", ".bin", "uglifyjs");
	sh.exec(`${browserify} ${path.join(inputDir, inputFileName)} -s ${path.basename(outputFileName, ".js")} | ${uglifyjs} --comments -o ${path.join(outputDir, outputFileName)}`);
}
function buildEngineFiles(version, buildMode, inputDir, outputDir) {
	build(
		buildMode === "canvas" ? "engineFiles.canvas.js" : "engineFiles.js",
		buildMode === "canvas" ? `engineFilesV${version}_Canvas.js` : `engineFilesV${version}.js`,
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
const outputDir = path.join(__dirname, "..", "dist", "raw", buildMode);
sh.mkdir("-p", outputDir);
buildEngineFiles(
	(packageJson["version"]).replace(/[\.-]/g, "_"),
	buildMode,
	inputDir,
	outputDir
);
buildPlayLogClient(
	(packageJson["optionalDependencies"]["@akashic/playlog-client"]).replace(/\./g, "_"),
	inputDir,
	outputDir
);
console.log("complete to build files");
