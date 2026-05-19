// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/ui',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxt/icon',
	],
	devtools: { enabled: process.env.NODE_ENV !== 'production' },
	app: {
		head: {
			title: 'Frontend Jobs',
			htmlAttrs: {
				lang: 'en',
			},
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'robots', content: 'index, follow' },
				...(process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION
					? [{ name: 'google-site-verification', content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION }]
					: []),
			],
			link: [
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{ rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'manifest', href: '/site.webmanifest' },
			],
		},
	},
	css: [
		'~/assets/styles/global.css',
	],
	colorMode: {
		preference: 'system',
		fallback: 'dark',
		classSuffix: '',
	},
	runtimeConfig: {
		public: {
			baseURL: process.env.API_BASE_URL,
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.frontendjobs.app',
			plausibleDomain: process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN || 'frontendjobs.app',
			plausibleEnabled: process.env.NUXT_PUBLIC_PLAUSIBLE_ENABLED === 'true',
			adsenseClient: process.env.NUXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-8184561234048018',
			adsenseEnabled: process.env.NUXT_PUBLIC_ADSENSE_ENABLED === 'true',
			googleSiteVerification: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
		},
	},
	routeRules: {
		'/company/**': { appMiddleware: 'auth' },
		'/company/payment-success': { appMiddleware: 'auth' },
	},
	nitro: {
		routeRules: {
			'/sitemap.xml': { headers: { 'Content-Type': 'application/xml' } },
		},
	},
	eslint: {
		checker: true,
		config: {
			tooling: true,
			stylistic: {
				indent: 'tab',
				semi: true,
			},
		},
	},
});
