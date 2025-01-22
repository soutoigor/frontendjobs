const WEBSITE_URL = 'https://frontendjobs.app';

export const defaultMetaTags = {
	title: 'Frontend Jobs – Find & Post Frontend Development Opportunities',
	keywords: 'frontend jobs, frontend developer jobs, post jobs, hire frontend developers, frontend opportunities',
	meta: [
		{ name: 'description', content: 'Discover and post frontend development job opportunities. Whether you\'re hiring or job hunting, our platform helps connect frontend developers with great companies.' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
		{ name: 'robots', content: 'index, follow' },
		{ property: 'og:title', content: 'Frontend Jobs – Find & Post Frontend Development Opportunities' },
		{ property: 'og:description', content: 'Discover and post frontend development job opportunities. Whether you\'re hiring or job hunting, our platform helps connect frontend developers with great companies.' },
		{ property: 'og:url', content: WEBSITE_URL },
		{ property: 'og:image', content: `${WEBSITE_URL}/frontend-jobs-icon.png` },
		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:title', content: 'Frontend Jobs – Find & Post Frontend Development Opportunities' },
		{ name: 'twitter:description', content: 'Discover and post frontend development job opportunities. Whether you\'re hiring or job hunting, our platform helps connect frontend developers with great companies.' },
		{ name: 'twitter:image', content: `${WEBSITE_URL}/frontend-jobs-icon.png` },
	],
	link: [
		{ rel: 'canonical', href: WEBSITE_URL },
	],
};

export const generateDynamicMetaTags = ({ title, description, url, image }: MetaTagsProps) => ({
	title,
	keywords: defaultMetaTags.keywords,
	meta: [
		{ name: 'description', content: description },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
		{ property: 'og:url', content: url },
		{ property: 'og:image', content: image },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: image },
	],
	link: [
		{ rel: 'canonical', href: url },
	],
});

interface MetaTagsProps {
	title: string;
	description: string;
	url: string;
	image: string;
	keywords: string;
}
