import * as fs from "fs";
import * as path from "path";
import { runScenario } from "../tests/helpers/runScenario";

(async () => {
	const fixturesPath = path.resolve(__dirname, "..", "tests", "fixtures");

	const contentPaths = fs
		.readdirSync(fixturesPath).map((filename) => path.join(fixturesPath, filename))
		.filter((filepath) => fs.statSync(filepath).isDirectory() && fs.existsSync(path.join(filepath, "game.json")));

	for (const contentPath of contentPaths) {
		console.log(`output expected data for ${path.basename(contentPath)} into the ${path.relative(path.join(__dirname, ".."), contentPath)}`);

		const expectedPath = path.join(contentPath, "expected");

		// unlink exists files
		fs
			.readdirSync(expectedPath)
			.map((filename) => path.join(expectedPath, filename))
			.filter((filepath) => fs.statSync(filepath).isFile()  && path.extname(filepath) === ".png")
			.forEach(fs.unlinkSync);

		await runScenario({
			contentPath,
			saveScreenshotHandler: (client, _age, opts) => {
				const canvas = client.getPrimarySurfaceCanvas();
				fs.writeFileSync(path.join(contentPath, opts.expectedFilename), canvas.toBuffer());
			}
		});
	}
})();
