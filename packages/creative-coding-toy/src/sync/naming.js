/**
 * Returns a formatted project name based on a file name.
 *
 * @param {string} basename
 */
export function friendly_name(basename) {
	// Extract tags from the end of the basename
	let match;
	for (let i = 0; i < tag_patterns.length; i++) {
		match = basename.match(tag_patterns[i]);
		if (match) break;
	}
	const base = (match ? match[1] : basename).trim();
	const tag = match?.[2].trim();

	const humanized_base = title_case(
		is_kebab_or_snake(base)
			? humanized_from_separators(base)
			: humanized_from_capitalization(base)
	);

	const humanized_tag =
		tag !== undefined &&
		(is_kebab_or_snake(tag)
			? humanized_from_separators(tag)
			: humanized_from_capitalization(tag));

	return humanized_tag
		? `${humanized_base} (${humanized_tag})`
		: humanized_base;
}

/**
 * @param {string} string
 */
function is_kebab_or_snake(string) {
	return string.includes("_") || string.includes("-");
}

/**
 * Returns a friendly version of a string from a kebab or snake case version.
 * Assumes that capitalization is intentional and does not modify it.
 *
 * @param {string} string
 */
function humanized_from_separators(string) {
	return string
		.split(occurrences("-", string) > occurrences("_", string) ? "-" : "_")
		.flatMap((part) =>
			Array.from(part.matchAll(snake_or_kebab_digits_regex)).map((m) => m[0])
		)
		.join(" ");
}

/**
 * Returns a friendly version of a string from a pascal or camel case version.
 * The returned sentence will be all lowercase except for acronyms.
 *
 * @param {string} string
 */
function humanized_from_capitalization(string) {
	return Array.from(string.matchAll(pascal_case_parts_regex))
		.map(([m]) => (m === m.toLocaleUpperCase() ? m : m.toLocaleLowerCase()))
		.join(" ");
}

/**
 * Returns the number of occurrences of a substring in a string.
 *
 * @param {string} term
 * @param {string} string
 */
function occurrences(term, string) {
	let count = 0;
	let last = -1;
	while ((last = string.indexOf(term, last + 1)) > -1) count++;
	return count;
}

/**
 * Converts a string to title case.
 *
 * Words with capitalization in them already will not be modified. Other words
 * will be capitalized if they are at the beginning of the string or aren't
 * part of the hard-coded exception list.
 *
 * @param {string} string
 */
function title_case(string) {
	return string.replace(/(\w|[^\u0000-\u007F])+'?\w*/g, (match, _, offset) => {
		if (match !== match.toLocaleLowerCase()) return match;
		if (offset > 0 && lowercase_title_words.has(match)) return match;

		return match[0].toLocaleUpperCase() + match.substring(1);
	});
}

const tag_patterns = [
	/^(.+)\s*\((.+)\)$/, // name (tag)
	/^(.+)\.(.+)$/, // name.tag
	/^(.+)\s*\[(.+)\]$/ // name [tag]
];

const pascal_case_parts_regex =
	/[\p{Lu}]?[\p{Ll}]+|\d+[\p{Ll}]*|[\p{Lu}]+(?=[\p{Lu}][\p{Ll}]|\d|\b)|[\p{Lo}]+/gu;

const snake_or_kebab_digits_regex = /\d+.*|\D+(?=\d|\b)/g;

const lowercase_title_words = new Set([
	// articles
	"a",
	"an",
	"the",
	// conjunctions
	"and",
	"as",
	"but",
	"if",
	"nor",
	"or",
	"so",
	"yet",
	// prepositions
	"as",
	"at",
	"by",
	"for",
	"in",
	"of",
	"off",
	"on",
	"to",
	"up",
	"via",
	// things that would be capitalized in most style guides but I disagree
	"with"
]);
