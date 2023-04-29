import { Pane } from 'tweakpane';

/**
 * @param {{[x: string]: string | number | {value: string | number;};}} schema
 * @param {(updates: any) => void} callback
 */
export function create_tweakpane(schema, callback) {
	/** @type {Record<string, number | string>} */
	let params;
	/** @type {Pane} */
	let pane;

	/**
	 * @param {typeof schema} s
	 * @param {typeof params} previous_params
	 */
	function configure(s, previous_params) {
		for (const k of Object.keys(s)) {
			let value;
			let settings;
			const v = s[k];
			if (typeof v === 'object') {
				({ value, ...settings } = v);
			} else {
				value = v;
			}
			params[k] = k in previous_params ? previous_params[k] : value;
			pane.addInput(params, k, settings);
		}
	}

	/** @param {import("tweakpane").TpChangeEvent<unknown>} event */
	function on_change(event) {
		if (!event.presetKey) return;
		callback({ [event.presetKey]: event.value });
	}

	params = {};
	pane = new Pane();
	pane.on('change', on_change);
	configure(schema, {});

	return {
		pane,
		params,

		/**
		 * @param {typeof schema} new_schema
		 */
		update_schema(new_schema) {
			pane.dispose();
			const old_params = params;
			params = this.params = {};
			pane = this.pane = new Pane();
			pane.on('change', on_change);
			configure(new_schema, old_params);
		},

		destroy() {
			pane.dispose();
		}
	};
}
