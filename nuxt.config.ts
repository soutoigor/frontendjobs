// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	debug: true,
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
			baseURL: 'http://192.168.1.94:8000/api/',
		},
	},
	css: [
		'~/assets/styles/global.css',
	],
	routeRules: {
		'/company/**': { appMiddleware: 'auth' },
	},
	plugins: ['~/plugins/firebase.ts'],
});
