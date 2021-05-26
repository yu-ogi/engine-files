export type ScenarioEvent = ScenarioPointDownEvent | ScenarioPointUpEvent;

export interface ScenarioPointDownEvent {
	type: "pointDown";
	id: number;
	x: number;
	y: number;
}

export interface ScenarioPointUpEvent {
	type: "pointUp";
	id: number;
	x: number;
	y: number;
}

export interface ScenarioSaveScreenshotOption {
	expectedFilename: string;
}

export interface Scenario {
	age: number;
	events?: ScenarioEvent[];
	saveScreenshot?: ScenarioSaveScreenshotOption;
}
