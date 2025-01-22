<template>
	<div class="featured-technologies">
		<template
			v-for="tech of featuredTechnologies"
			:key="tech.name"
		>
			<button
				v-if="tech.id"
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
		</template>
	</div>
</template>

<script setup lang="ts">
import AngularLogo from '../../assets/angular-logo.svg';
import ReactLogo from '../../assets/react-logo.svg';
import SvelteLogo from '../../assets/svelte-logo.svg';
import VueLogo from '../../assets/vue-logo.svg';

import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import { useFilterOptions } from '~/composables/use-filter-options';

const store = useJobOpportunitiesStore();
const { technologies } = useFilterOptions();

const FEATURED_TECHNOLOGIES = [
	{
		name: 'Vue.js',
		image: VueLogo,
	},
	{
		name: 'Svelte',
		image: SvelteLogo,
	},
	{
		name: 'Angular',
		image: AngularLogo,
	},
	{
		name: 'React',
		image: ReactLogo,
	},
];
const featuredTechnologies = computed(
	() => FEATURED_TECHNOLOGIES
		.map(tech => ({
			...tech,
			id: technologies.value.find(technology => technology.name === tech.name)?.id,
		})),
);

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
