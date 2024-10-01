import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
	content: [
		'./pages/**/*.{html,js,vue}',
		'./components/**/*.{html,js,vue}',
	],
	theme: {
		extend: {
			colors: {
			},
		},
	},
};
