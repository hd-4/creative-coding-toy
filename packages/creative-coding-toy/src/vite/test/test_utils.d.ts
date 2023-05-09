import {
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
	TestType
} from "@playwright/test";

export const test: TestType<
	PlaywrightTestArgs &
		PlaywrightTestOptions & {
			output: {
				waitForRendered(): Promise<Record<string, number | string>>;
			};
		},
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;
