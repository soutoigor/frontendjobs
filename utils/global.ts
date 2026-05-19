/**
 * Formats the salary range as a text string.
 * @param currency - The currency symbol or code.
 * @param salary_minimum - The minimum salary value.
 * @param salary_maximum - The maximum salary value (optional).
 * @returns The formatted salary range as a text string.
 */
export function getSalaryText(currency: string, salary_minimum: string, salary_maximum?: string): string {
	const minSalary = formatSalary(Number(salary_minimum.replace(/,/g, '')));
	const maxSalary = salary_maximum ? formatSalary(Number(salary_maximum.replace(/,/g, ''))) : '';

	return maxSalary ? `${currency} ${minSalary} - ${maxSalary}` : `${currency} ${minSalary}`;
}

export function formatSalary(salary: number): string {
	if (salary >= 1000) {
		return (salary / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	}
	return salary.toString();
}

export function formatList(value?: string | string[] | null): string {
	if (!value) {
		return '';
	}

	return Array.isArray(value) ? value.filter(Boolean).join(', ') : value;
}

export function getOptimizedAvatarUrl(avatar?: string | null, size = 80): string {
	if (!avatar || !avatar.includes('res.cloudinary.com') || !avatar.includes('/image/upload/')) {
		return avatar || '';
	}

	return avatar.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_fill,w_${size},h_${size}/`);
}

export function timeAgo(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	const intervals = [
		{ label: 'year', seconds: 31536000 },
		{ label: 'month', seconds: 2592000 },
		{ label: 'week', seconds: 604800 },
		{ label: 'day', seconds: 86400 },
		{ label: 'hour', seconds: 3600 },
		{ label: 'minute', seconds: 60 },
		{ label: 'second', seconds: 1 },
	];

	for (const interval of intervals) {
		const count = Math.floor(diffInSeconds / interval.seconds);
		if (count >= 1) {
			return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
		}
	}

	return 'just now';
}

/**
 * Filters out values that are either `null`, `undefined`, or empty.
 *
 * This utility checks arrays, nullish values, and empty strings to determine
 * if a value should be filtered out.
 *
 * @param value - The object to be filtered.
 * @returns A boolean indicating whether the value is `null`, `undefined`, or empty.
 */
export function filterNilOrEmpty<T extends Record<string, unknown>>(value: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => {
			if (Array.isArray(entry)) {
				return entry.length > 0;
			}

			return entry !== null && entry !== undefined && entry !== '';
		}),
	) as Partial<T>;
}
