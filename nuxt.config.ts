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
			baseURL: 'http://127.0.0.1:8000/api/',
		},
	},
	css: [
		'~/assets/styles/global.css',
	],
});
