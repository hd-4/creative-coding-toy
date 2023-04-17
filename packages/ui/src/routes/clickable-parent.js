import { preloadData } from '$app/navigation';

/**
 * A Svelte action that makes clicks on a parent element act as if a link within
 * was clicked. The parent will be given a `data-clickable` attribute for
 * styling. It will also have its cursor style set to pointer.
 *
 * @param {HTMLElement} element
 */
export function clickable_parent(element) {
	/** @type {HTMLAnchorElement | null} */
	const target = element.querySelector('a');

	/** @type {NodeJS.Timeout} */
	let move_timeout;

	/** @type {EventListener} */
	function on_click(event) {
		if (!target || event.target === target) return;
		target.click();
	}

	/** @type {EventListener} */
	function on_move(event) {
		if (!target || event.target === target) return;
		clearTimeout(move_timeout);
		move_timeout = setTimeout(() => {
			preloadData(target.href);
		}, 20);
	}

	element.addEventListener('click', on_click);
	element.addEventListener('mousemove', on_move);
	element.dataset.clickable = 'true';
	element.style.cursor = 'pointer';

	return {
		destroy() {
			element.removeEventListener('mousemove', on_move);
			element.removeEventListener('click', on_click);
		}
	};
}
