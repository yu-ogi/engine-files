import * as fs from "fs";
import * as path from "path";
import { PNG } from "pngjs";
import * as pixelmatch from "pixelmatch";
import type { Scenario } from "./scenario";

export interface RunScenarioParameterObject {
	entrySceneName: string;
	outputDir: string;
	seed: number;
	contentPath: string;
	scenarios: Scenario[];
	threshold: number;
	filenameTransformer: (age: number) => string;
}

export interface RunScenarioResult {
	age: number;
	missingPixels: number;
}

export async function runScenario(params: RunScenarioParameterObject): Promise<RunScenarioResult[]> {
	// NOTE: headless-driver に process.env.ENGINE_FILES_V3 の値を適用するため動的に読み込む
	const { GameContext } = await import("@akashic/headless-akashic");

	const contentPath = params.contentPath;
	const actualPath = path.join(contentPath, "actual", params.outputDir);
	const diffPath = path.join(contentPath, "diff", params.outputDir);
	const threshold = params.threshold;
	const filenameTransformer = params.filenameTransformer;

	const context = new GameContext({
		gameJsonPath: path.join(contentPath, "game.json")
	});

	const client = await context.getGameClient({
		renderingMode: "canvas",
		externalValue: {
			getSeed: () => params.seed
		}
	});

	await client.advanceUntil(() => client.game.scene().name === params.entrySceneName);

	const width = client.game.width;
	const height = client.game.height;
	const canvas = client.getPrimarySurfaceCanvas();

	const result: RunScenarioResult[] = [];

	// unlink exists files
	[
		...fs.readdirSync(actualPath).map((filename) => path.join(actualPath, filename)),
		...fs.readdirSync(diffPath).map((filename) => path.join(diffPath, filename))
	]
		.filter((filepath) => fs.statSync(filepath).isFile() && path.extname(filepath) === ".png")
		.forEach(fs.unlinkSync);

	for (let scenario of params.scenarios) {
		const age = scenario.age;
		await client.advanceUntil(() => age <= client.game.age);

		if (scenario.events) {
			for (let event of scenario.events) {
				if (event.type === "pointDown") {
					client.sendPointDown(event.x, event.y, event.id);
				} else if (event.type === "pointUp") {
					client.sendPointUp(event.x, event.y, event.id);
				}
			}
		}

		if (scenario.saveScreenshot) {
			const canvasContext = client.getPrimarySurfaceCanvas().getContext("2d");
			const expected = PNG.sync.read(fs.readFileSync(path.join(contentPath, scenario.saveScreenshot.expectedFilename)));
			const actual = canvasContext.getImageData(0, 0, width, height);
			const diff = new PNG({ width, height });

			const missingPixels = pixelmatch(expected.data, actual.data, diff.data, width, height, {
				threshold
			});

			const diffPNG = PNG.sync.write(diff);
			fs.writeFileSync(path.join(diffPath, filenameTransformer(age)), diffPNG);
			fs.writeFileSync(path.join(actualPath, filenameTransformer(age)), canvas.toBuffer());

			result.push({
				age,
				missingPixels
			});
		}
	}

	await context.destroy();

	return result;
}
