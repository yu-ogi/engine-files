import * as path from "path";
import { runScenario } from "./helpers/runScenario";

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			ENGINE_FILES_V3_PATH: string;
		}
	}
}

const packageJSON = require("../package.json");
const version = packageJSON.version.replace(/[\.-]/g, "_");
const subDirectories = ["debug/full", "debug/canvas", "release/full", "release/canvas"];
const seed = 42;

describe("reftest - acobench", (): void => {
	for (const subDirectory of subDirectories) {
		describe(subDirectory, () => {
			const subDirectory = "debug/full";

			beforeAll(() => {
				process.env.ENGINE_FILES_V3_PATH = path.resolve(__dirname, "..", "dist", "raw", subDirectory, `engineFilesV${version}.js`);
			});

			test("compares pixels", async () => {
				const results = await runScenario({
					entrySceneName: "entry-scene",
					outputDir: subDirectory,
					contentPath: path.join(__dirname, "fixtures", "acobench"),
					scenarios: require("./fixtures/acobench/scenario.json"),
					threshold: 0.1,
					seed,
					filenameTransformer: age => `age_${("0000" + age).slice(-4)}_seed_${seed}.png`
				});

				for (let result of results) {
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
