import * as path from "path";
import { GameClient } from "@akashic/headless-akashic";
import type { Scenario, ScenarioFrame, ScenarioFrameEvent, ScenarioFrameSaveScreenshotOption } from "./scenario";

export interface RunScenarioParameterObject {
	contentPath: string;
	eventHandler?: (client: GameClient, age: number, event: ScenarioFrameEvent, frame: ScenarioFrame) => void;
	saveScreenshotHandler?: (client: GameClient, age: number, opts: ScenarioFrameSaveScreenshotOption, frame: ScenarioFrame) => void;
}

export async function runScenario(params: RunScenarioParameterObject): Promise<void> {
	// NOTE: headless-driver に process.env.ENGINE_FILES_V3 の値を適用するため動的に読み込む
	const { GameContext } = await import("@akashic/headless-akashic");

	const contentPath = params.contentPath;
	const scenario: Scenario = require(path.join(contentPath, "scenario.json"));
	const seed = scenario.seed;

	const context = new GameContext({
		gameJsonPath: path.join(contentPath, "game.json")
	});

	const client = await context.getGameClient({
		renderingMode: "canvas",
		externalValue:
			seed != null
				? {
					getSeed: () => seed
				  }
				: {
					//
				  }
	});

	for (let frame of scenario.frames) {
		const age = frame.age;
		await client.advanceUntil(() => age <= client.game.age);

		if (frame.events) {
			for (let event of frame.events) {
				if (event.type === "pointDown") {
					client.sendPointDown(event.x, event.y, event.id);
				} else if (event.type === "pointUp") {
					client.sendPointUp(event.x, event.y, event.id);
				}
				params.eventHandler?.(client, age, event, frame);
			}
		}

		if (frame.saveScreenshot) {
			params.saveScreenshotHandler?.(client, age, frame.saveScreenshot, frame);
		}
	}

	await context.destroy();
}
