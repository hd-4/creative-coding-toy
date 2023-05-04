/**
 * @template {object} T
 * @param {T} initial_values
 * @returns {import("./types").LiveInputs<T>}
 */
export function live_inputs(initial_values) {
	const values = { ...initial_values };

	/** @type {Map<string, Set<string | number | symbol>>} */
	const span_references = new Map();

	/** @type {string | null} */
	let current_span = null;

	const proxy = new Proxy(values, {
		get(target, prop, receiver) {
			if (current_span) span_references.get(current_span)?.add(prop);
			return Reflect.get(target, prop, receiver);
		}
	});

	return {
		proxy,

		/**
		 * @param {string} name
		 */
		start_span(name) {
			span_references.set(name, new Set());
			current_span = name;
		},

		end_span() {
			current_span = null;
		},

		/**
		 * @param {Partial<T>} new_values
		 */
		update(new_values) {
			/** @type {Set<string>} */
			const affected_spans = new Set();
			for (const key of /** @type {(keyof T)[]} */ (Object.keys(new_values))) {
				values[key] = /** @type {T[keyof T]} */ (new_values[key]);

				for (const [span_name, references] of span_references) {
					if (references.has(key)) affected_spans.add(span_name);
				}
			}
			return affected_spans;
		}
	};
}
