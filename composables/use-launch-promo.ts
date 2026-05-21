/**
 * Launch promo: while active, job posts are free.
 * Set `active` to false (and flip STRIPE_ENABLED=true on the API) to end.
 */
const config = {
	active: true,
	bannerMessage: 'Launch special — free job posts while we get rolling.',
	bannerCta: 'Post a job',
	bannerCtaTo: '/company/post-job',
	heroStatLabel: 'Post during launch',
	heroStatValue: 'FREE',
	postJobSubtitle: 'Fill the listing once — preview before publishing. Free posts during our launch period.',
	previewAlertTitle: 'Free during launch',
	previewAlertDescription: 'No payment needed. After you publish, the job goes live and you return to your company dashboard.',
	registerBenefit: 'Free job posts during launch',
	orderSummaryPrice: 'FREE',
	orderSummaryNote: 'No payment required during our launch period. Your post publishes immediately.',
	publishButtonLabel: 'Publish for free',
};

export function useLaunchPromo() {
	return config;
}
