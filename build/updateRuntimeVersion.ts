import { promises as fsPromises, existsSync } from "fs";
import * as path from "path";

interface RuntimeVersionJSON {
	"//": string;
	"version": string;
}

type Operation = "bump" | "reset";

try {
	main(process.argv[2] as Operation);
} catch (e) {
	console.error(e.message);
	process.exit(1);
}

async function main(operation: Operation) {
	if (process.argv.length < 3 || (operation !== "bump" && operation !== "reset")) {
		console.error("please enter command as follows: ts-node updateRuntimeVersion.ts {bump|reset}");
		console.error("Usage: ts-node updateRuntimeVersion.ts bump");
		process.exit(1);
	}

	const runtimeVersionJSONPath = path.join(__dirname, "..", "runtime-version.json");

	let ret: RuntimeVersionJSON;

	if (operation === "reset" || !existsSync(runtimeVersionJSONPath)) {
		console.log(`reset runtime-version`);
		ret = {
			"//": "このファイルは内部的に利用されます。手動での変更は避けてください。",
			"version": "0"
		};
	} else if (operation === "bump") {
		const currentJSON: RuntimeVersionJSON = require(runtimeVersionJSONPath);
		const currentVersion: string = currentJSON.version;
		const nextVersion: string = (Number(currentVersion) + 1).toString();
		console.log(`bump runtime-version ${currentVersion} -> ${nextVersion}`);
		ret = {
			...currentJSON,
			version: nextVersion
		};
	}

	await writeRuntimeVersion(runtimeVersionJSONPath, ret);
}

async function writeRuntimeVersion(filepath: string, content: RuntimeVersionJSON) {
	await fsPromises.writeFile(
		filepath,
		JSON.stringify(content, undefined, 2)
	);
}
