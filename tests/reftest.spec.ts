import * as fs from "fs";
import * as path from "path";
import { runReftest } from "./helpers/runReftest";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ENGINE_FILES_V3_PATH: string;
		}
	}
}

const packageJSON = require("../package.json");
const version = packageJSON.version.replace(/[\.-]/g, "_");
const seed = 42;
const engineFilesPaths = [
	{
		subDirectory: "debug/full",
		engineFilesName: `engineFilesV${version}.js`
	},
	{
		subDirectory: "debug/canvas",
		engineFilesName: `engineFilesV${version}_Canvas.js`
	},
	{
		subDirectory: "release/full",
		engineFilesName: `engineFilesV${version}.js`
	},
	{
		subDirectory: "release/canvas",
		engineFilesName: `engineFilesV${version}_Canvas.js`
	}
];
const fixturesPath = path.join(__dirname, "fixtures");
const contentNames = fs
	.readdirSync(fixturesPath)
	.filter((filename) => fs.statSync(path.join(fixturesPath, filename)).isDirectory() && fs.existsSync(path.join(fixturesPath, filename, "game.json")));

for (const contentName of contentNames) {
	describe(`reftest - ${contentName}`, (): void => {
		for (const engineFilesPath of engineFilesPaths) {
			describe(engineFilesPath.subDirectory, () => {
				beforeAll(() => {
					process.env.ENGINE_FILES_V3_PATH = path.resolve(__dirname, "..", "dist", "raw", engineFilesPath.subDirectory, engineFilesPath.engineFilesName);
				});

				test("compares pixels", async () => {
					const results = await runReftest({
						outputDir: engineFilesPath.subDirectory,
						contentPath: path.join(fixturesPath, contentName),
						threshold: 0.1,
						filenameTransformer: age => `age_${("0000" + age).slice(-4)}_seed_${seed}.png`
					});

					for (const result of results) {
						expect(result.missingPixels).toBe(0);
					}
				});

				afterAll(() => {
					delete process.env.ENGINE_FILES_V3_PATH;
					jest.resetModules();
				});
			});
		}
	});
}
