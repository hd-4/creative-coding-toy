/**
 * @param {Record<string, unknown>} values
 */
export function update_output(values) {
	window.TEST_OUTPUT = {
		updated: Date.now(),
		values: {
			...(window.TEST_OUTPUT?.values ?? {}),
			...values
		}
	};
}
