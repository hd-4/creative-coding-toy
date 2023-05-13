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
			project: {
				waitForLifecycleLog(event?: string): Promise<string>;
			};
		},
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;
