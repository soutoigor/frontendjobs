<template>
	<article class="index">
		<div class="index__hero">
			<UContainer class="index__presentation">
				<AppLogo class="index__title" />
				<SearchJobInput />
			</UContainer>

			<div class="index__technologies-wrapper">
				<h2 class="index__subtitle">
					Find the best job opportunities with your favorite technologies.
				</h2>
				<FeaturedTechnologies class="index__featured-technologies" />
			</div>
		</div>
		<UContainer class="index__content">
			<JobFilters />
			<JobOpportunities />
		</UContainer>
	</article>
</template>

<script setup lang="ts">
import SearchJobInput from '~/components/shared/search-job-input.vue';
import FeaturedTechnologies from '~/components/home/featured-technologies.vue';
import JobFilters from '~/components/shared/job-filters.vue';
import JobOpportunities from '~/components/job-opportunities/job-opportunities.vue';
import AppLogo from '~/components/shared/app-logo.vue';

import { defaultMetaTags } from '~/utils/meta-tags';

useHead(defaultMetaTags);
</script>

<style scoped>
.index {
  @apply flex flex-col min-h-screen pb-8;

	&__hero {
		background-image: url('../assets/hero-dev.jpg');
		@apply w-full flex-col relative bg-cover bg-no-repeat bg-top flex justify-center items-center py-36 px-12;
	}

	&__technologies-wrapper {
		@apply flex flex-col items-center gap-6 absolute -bottom-11;
	}

	&__presentation {
		@apply flex flex-col items-center gap-6 pb-16;
	}

  &__title {
    @apply text-5xl sm:text-7xl font-light;
  }

	&__subtitle {
		@apply font-light w-full text-xl text-center sm:max-w-[60%] tracking-widest;
	}

	&__content {
		@apply w-full mt-24 flex flex-col gap-8 lg:max-w-[75%] xl:max-w-[55%] mx-auto;
	}
}
</style>
