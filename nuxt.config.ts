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
			firebaseApiKey: process.env.FIREBASE_API_KEY,
			firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
			firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
			firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
		},
	},
	css: [
		'~/assets/styles/global.css',
	],
	routeRules: {
		'/company/**': { appMiddleware: 'auth' },
	},
	plugins: ['~/plugins/firebase.ts'],
	app: {
		head: {
			title: 'Frontend Jobs',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ name: 'robots', content: 'index, follow' },
			],
			link: [
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'manifest', href: '/site.webmanifest' },
			],
			script: [
				{
					hid: 'tawk.to',
					src: 'https://embed.tawk.to/678843b3825083258e05daee/1ihm4gtii',
					defer: true,
					async: true,
				},
				{
					src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8184561234048018',
					crossorigin: 'anonymous',
					async: true,
				},
			],
		},
	},
	nitro: {
		routeRules: {
			'/sitemap.xml': { headers: { 'Content-Type': 'application/xml' } },
		},
	},
});
