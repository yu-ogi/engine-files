export type ScenarioFrameEvent = ScenarioFramePointDownEvent | ScenarioFramePointUpEvent;

export interface ScenarioFramePointDownEvent {
	type: "pointDown";
	id: number;
	x: number;
	y: number;
}

export interface ScenarioFramePointUpEvent {
	type: "pointUp";
	id: number;
	x: number;
	y: number;
}

export interface ScenarioFrameSaveScreenshotOption {
	expectedFilename: string;
}

export interface ScenarioFrame {
	age: number;
	events?: ScenarioFrameEvent[];
	saveScreenshot?: ScenarioFrameSaveScreenshotOption;
}

export interface Scenario {
	entrySceneName: string;
	seed?: number;
	frames: ScenarioFrame[];
}
