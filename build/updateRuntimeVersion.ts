import * as fs from "fs";

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
	const path = await import("path");
	const runtimeVersionJSONPath = path.join(__dirname, "..", "runtime-version.json");

	if (process.argv.length < 3 || (operation !== "bump" && operation !== "reset")) {
		console.error("please enter command as follows: ts-node updateRuntimeVersion.ts {bump|reset}");
		console.error("Usage: ts-node updateRuntimeVersion.js bump");
		process.exit(1);
	}

	let ret: RuntimeVersionJSON;

	if (operation === "reset" || !fs.existsSync(runtimeVersionJSONPath)) {
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

async function writeRuntimeVersion(path: string, content: RuntimeVersionJSON) {
	return new Promise<void>((resolve, reject) => {
		fs.writeFile(
			path,
			JSON.stringify(content, undefined, 2),
			(err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
}
