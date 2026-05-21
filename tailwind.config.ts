import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
	content: [
		'./pages/**/*.{html,js,vue}',
		'./components/**/*.{html,js,vue}',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', ...defaultTheme.fontFamily.sans],
				mono: ['"SFMono-Regular"', '"Roboto Mono"', ...defaultTheme.fontFamily.mono],
			},
			colors: {
				surface: {
					DEFAULT: '#0b0d12',
					raised: 'rgba(15,17,23,0.6)',
					footer: '#080a0e',
				},
				accent: {
					DEFAULT: '#a78bfa',
					ink: '#0b0d12',
					muted: 'rgba(167,139,250,0.12)',
				},
			},
			borderColor: {
				subtle: 'rgba(255,255,255,0.06)',
				section: 'rgba(255,255,255,0.08)',
			},
		},
	},
};
