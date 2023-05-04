/**
 * @param {any} mod
 * @param {HTMLElement} element
 */
export function mount(mod, element) {
	const text = mod.default();
	element.textContent = text;

	return {
		destroy() {}
	};
}
