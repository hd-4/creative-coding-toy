import {
	PlaywrightTestArgs,
	PlaywrightTestConfig,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
	TestType
} from "@playwright/test";

export const test: TestType<
	PlaywrightTestArgs &
		PlaywrightTestOptions & {
			app: {
				gotoIndex(): Promise<void>;
			};
			project: {
				waitForLifecycleLog(event?: string): Promise<string>;
				waitForLifecycleLogs(...event: string[]): Promise<string>;
			};
		},
	PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;

export const config: PlaywrightTestConfig;
