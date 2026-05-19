// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		'@nuxt/ui',
		'@nuxtjs/i18n',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'@nuxt/eslint',
		'@nuxt/image',
		'@nuxt/icon',
	],
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
	runtimeConfig: {
		public: {
			baseURL: process.env.API_BASE_URL,
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.frontendjobs.app',
		},
	},
	css: [
		'~/assets/styles/global.css',
	],
	routeRules: {
		'/company/**': { appMiddleware: 'auth' },
		'/company/payment-success': { appMiddleware: 'auth' },
	},
	app: {
		head: {
			title: 'Frontend Jobs',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'robots', content: 'index, follow' },
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
			script: [
				{
					src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8184561234048018',
					crossorigin: 'anonymous',
					async: true,
				},
			],
		},
	},
	colorMode: {
		preference: 'system',
		fallback: 'dark',
		classSuffix: '',
	},
	nitro: {
		routeRules: {
			'/sitemap.xml': { headers: { 'Content-Type': 'application/xml' } },
		},
	},
});
