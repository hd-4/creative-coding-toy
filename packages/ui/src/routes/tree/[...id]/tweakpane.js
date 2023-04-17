import { Pane } from 'tweakpane';

/**
 * @param {{[x: string]: string | number | {value: string | number;};}} schema
 * @param {() => void} callback
 */
export function create_tweakpane(schema, callback) {
	/** @type {Record<string, number | string>} */
	let params;
	/** @type {Pane} */
	let pane;

	/**
	 * @param {typeof schema} s
	 */
	function configure(s) {
		for (const k of Object.keys(s)) {
			let value;
			let settings;
			const v = s[k];
			if (typeof v === 'object') {
				({ value, ...settings } = v);
			} else {
				value = v;
			}
			params[k] = value;
			pane.addInput(params, k, settings);
		}
	}

	params = {};
	pane = new Pane();
	pane.on('change', callback);
	configure(schema);

	return {
		pane,
		params,

		/**
		 * @param {typeof schema} new_schema
		 */
		update_schema(new_schema) {
			pane.dispose();
			params = this.params = {};
			pane = this.pane = new Pane();
			pane.on('change', () => callback());
			configure(new_schema);
		},

		destroy() {
			pane.dispose();
		}
	};
}
