import * as childProcess from "child_process";
import * as fs from "fs/promises";
import * as path from "path";
import * as util from "util";

const exec = util.promisify(childProcess.exec);
const root = path.resolve(__dirname, "..");
const packageJSON = require(path.resolve(root, "package.json"));
const cwd = root;
const version = packageJSON.version.replace(/[\.-]/g, "_");
const name = `engineFilesV${version}`;

async function main() {
	await fs.mkdir(path.resolve(root, "dist", "raw", "debug", "full"), { recursive: true });
	await fs.mkdir(path.resolve(root, "dist", "raw", "release", "full"), { recursive: true });

	await exec(`npx -y browserify ./src/engineFiles.js -t [babelify] -s ${name} -o ./dist/raw/debug/full/${name}.js`, { cwd });
	await exec(`npx -y uglifyjs ./dist/raw/debug/full/${name}.js --comments -o ./dist/raw/release/full/${name}.js`, { cwd });
}

main()
	.catch((e) => {
		console.error(e.message);
		process.exit(1);
	});
