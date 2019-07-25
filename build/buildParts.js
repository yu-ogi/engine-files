const path = require("path");
const sh = require("shelljs");
const fs = require("fs");

if (process.argv.length < 3) {
	console.error("please enter command as follows: node buildParts.js [buildMode]");
	console.error("ex: node buildParts.js full");
	process.exit(1);
}
const buildMode = process.argv[2];
if (! /^(full|canvas)$/.test(buildMode)) {
	console.error("please specify one of the following string [full, canvas]");
	process.exit(1);
}

console.log("start to build files");
function build(inputFileName, outputFileName, inputDir, outputDir, debug, es5Downpile = false) {
	const browserify = path.join(__dirname, "..", "node_modules", ".bin", "browserify");
	const uglifyjs = path.join(__dirname, "..", "node_modules", ".bin", "uglifyjs");
	let ret;
	if (debug) {
		ret = sh.exec(`${browserify} ${path.resolve(inputDir, inputFileName)} -d -s ${path.basename(outputFileName, ".js")} | ${es5Downpile ? "babel |" : ""} > ${path.join(outputDir, outputFileName)}`);
	} else {
		ret = sh.exec(`${browserify} ${path.resolve(inputDir, inputFileName)} -s ${path.basename(outputFileName, ".js")} | ${es5Downpile ? "babel |" : ""} ${uglifyjs} --comments -o ${path.join(outputDir, outputFileName)}`);
	}
	if (0 < ret.code) {
		throw new Error("error occurred");
	}
}
function buildEngineFiles(version, buildMode, inputDir, outputDir, debug) {
	build(
		buildMode === "canvas" ? "engineFiles.canvas.js" : "engineFiles.js",
		buildMode === "canvas" ? `engineFilesV${version}_Canvas.js` : `engineFilesV${version}.js`,
		inputDir,
		outputDir,
		debug
	);
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
		outputDir,
		undefined,
		true
	);
}

const packageJson = require(path.join(__dirname, "..", "package.json"));
const inputDir = path.join(__dirname, "..", "src");

sh.mkdir("-p", path.join(__dirname, "..", "dist", "raw", "release", buildMode));
sh.mkdir("-p", path.join(__dirname, "..", "dist", "raw", "debug", buildMode));

try {
	console.log("build engine-files");
	buildEngineFiles(
		(packageJson["version"]).replace(/[\.-]/g, "_"),
		buildMode,
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "release", buildMode),
		false
	);
	buildEngineFiles(
		(packageJson["version"]).replace(/[\.-]/g, "_"),
		buildMode,
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "debug", buildMode),
		true
	);

	console.log("build playlog-client");
	buildPlayLogClient(
		(packageJson["optionalDependencies"]["@akashic/playlog-client"]).replace(/\./g, "_"),
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "release", buildMode)
	);
	buildPlayLogClient(
		(packageJson["optionalDependencies"]["@akashic/playlog-client"]).replace(/\./g, "_"),
		inputDir,
		path.join(__dirname, "..", "dist", "raw", "debug", buildMode)
	);
} catch (e) {
	process.exit(1);
}

console.log("complete to build files");
