// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
	files: ['**/*.ts', '**/*.vue'],
	rules: {
		'no-console': 'off',
		'vue/no-v-html': 'off',
		'@stylistic/no-mixed-spaces-and-tabs': 'off',
	},
});
