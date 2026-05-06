import type { JobPostingTier } from '~/types/job-opportunities';

export interface PostingTierOption {
	key: JobPostingTier;
	label: string;
	price: number;
	amountCents: number;
	description: string;
	cardLabel?: string;
}

export const postingTiers: PostingTierOption[] = [
	{
		key: 'standard',
		label: 'Standard',
		price: 99,
		amountCents: 9900,
		description: 'A 30-day listing in the regular job feed.',
	},
	{
		key: 'featured',
		label: 'Featured',
		price: 149,
		amountCents: 14900,
		description: 'Higher placement plus a subtle Featured badge.',
		cardLabel: 'Featured',
	},
	{
		key: 'spotlight',
		label: 'Spotlight',
		price: 199,
		amountCents: 19900,
		description: 'Top priority placement with a tasteful Spotlight treatment.',
		cardLabel: 'Spotlight',
	},
];

export const defaultPostingTier: JobPostingTier = 'standard';

export function getPostingTier(tier?: JobPostingTier): PostingTierOption {
	return postingTiers.find(option => option.key === tier) || postingTiers[0];
}

export function formatPostingTierPrice(tier?: JobPostingTier): string {
	return `$${getPostingTier(tier).price}`;
}

export function formatAmountCents(amountCents?: number | null, currency = 'USD'): string {
	if (amountCents === undefined || amountCents === null) {
		return '$0';
	}

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0,
	}).format(amountCents / 100);
}
