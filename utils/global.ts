/**
 * Formats the salary range as a text string.
 * @param currency - The currency symbol or code.
 * @param salary_minimum - The minimum salary value.
 * @param salary_maximum - The maximum salary value (optional).
 * @returns The formatted salary range as a text string.
 */
export function getSalaryText(currency: string, salary_minimum: string, salary_maximum?: string): string {
	const formatSalary = (salary: number) => {
		if (salary >= 1000) {
			return (salary / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		}
		return salary.toString();
	};

	const minSalary = formatSalary(Number(salary_minimum));
	const maxSalary = salary_maximum ? formatSalary(Number(salary_maximum)) : '';

	return maxSalary ? `${currency} ${minSalary} - ${maxSalary}` : `${currency} ${minSalary}`;
}

export function formatSalary(salary: number): string {
	if (salary >= 1000) {
		return (salary / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	}
	return salary.toString();
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
