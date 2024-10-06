<template>
	<div class="featured-technologies">
		<button
			v-for="tech of FEATURED_TECHNOLOGIES"
			:key="tech.name"
			class="featured-technologies__technology"
			:class="{
				'-selected': store.filters.technologies.includes(tech.id),
			}"
			@click="selectTechnology(tech.id)"
		>
			<img
				:src="tech.image"
				:alt="tech.name"
			>
		</button>
	</div>
</template>

<script setup lang="ts">
import AngularLogo from '../../assets/angular-logo.svg';
import ReactLogo from '../../assets/react-logo.svg';
import SvelteLogo from '../../assets/svelte-logo.svg';
import VueLogo from '../../assets/vue-logo.svg';

import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();

const FEATURED_TECHNOLOGIES = [
	{
		id: '78189c6d-2c18-43e9-b9e2-63218cb59558',
		name: 'Vue.js',
		image: VueLogo,
	},
	{
		id: '0f5b5f6d-6821-4184-baf8-8c884a9813ea',
		name: 'Svelte',
		image: SvelteLogo,
	},
	{
		id: '99301b7d-2214-4186-a7e7-7cb4539110c2',
		name: 'Angular',
		image: AngularLogo,
	},
	{
		id: '24aea839-572b-4e33-8680-f416fd9b4a04',
		name: 'React',
		image: ReactLogo,
	},
];

function selectTechnology(technologyId: string) {
	if (store.filters.technologies.includes(technologyId)) {
		store.filters.technologies = store.filters.technologies.filter(tech => tech !== technologyId);
	}
	else {
		store.filters.technologies.push(technologyId);
	}
}
</script>

<style scoped>
.featured-technologies {
	@apply flex gap-3 justify-between;

	&__technology {
		@apply flex items-center p-3 bg-gray-900 justify-center w-20 h-20 sm:w-24 sm:h-24 border-purple-600 border-2 rounded-xl;
		@apply shadow-lg hover:bg-purple-800 transition-all duration-300;

		img {
			@apply h-full transition-transform duration-100;
		}

		&.-selected {
			@apply bg-purple-700;
		}

		&:hover {
			img {
				@apply transform scale-105 transition-transform duration-100;
			}
		}
	}
}
</style>
