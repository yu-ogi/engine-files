import * as fs from "fs";
import * as path from "path";
import { PNG } from "pngjs";
import * as pixelmatch from "pixelmatch";
import type { ScenarioFrame } from "./scenario";
import { runScenario } from "./runScenario";

export interface RunReftestParameterObject {
	outputDir: string;
	contentPath: string;
	threshold: number;
	filenameTransformer: (age: number, frame: ScenarioFrame) => string;
}

export interface RunReftestResult {
	age: number;
	missingPixels: number;
}

export async function runReftest(params: RunReftestParameterObject): Promise<RunReftestResult[]> {
	const contentPath = params.contentPath;
	const actualPath = path.join(contentPath, "actual", params.outputDir);
	const diffPath = path.join(contentPath, "diff", params.outputDir);
	const threshold = params.threshold;
	const filenameTransformer = params.filenameTransformer;

	const result: RunReftestResult[] = [];

	// unlink exists files
	[
		...fs.readdirSync(actualPath).map((filename) => path.join(actualPath, filename)),
		...fs.readdirSync(diffPath).map((filename) => path.join(diffPath, filename))
	]
		.filter((filepath) => fs.statSync(filepath).isFile() && path.extname(filepath) === ".png")
		.forEach(fs.unlinkSync);

	await runScenario({
		contentPath,
		saveScreenshotHandler: (client, age, opts, frame) => {
			const width = client.game.width;
			const height = client.game.height;
			const canvas = client.getPrimarySurfaceCanvas();
			const context = canvas.getContext("2d");
			const expected = PNG.sync.read(fs.readFileSync(path.join(contentPath, opts.expectedFilename)));
			const actual = context.getImageData(0, 0, width, height);
			const diff = new PNG({ width, height });

			const missingPixels = pixelmatch(expected.data, actual.data, diff.data, width, height, {
				threshold
			});

			const diffPNG = PNG.sync.write(diff);
			fs.writeFileSync(path.join(diffPath, filenameTransformer(age, frame)), diffPNG);
			fs.writeFileSync(path.join(actualPath, filenameTransformer(age, frame)), canvas.toBuffer());

			result.push({
				age,
				missingPixels
			});
		}
	});

	return result;
}
