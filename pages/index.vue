<template>
	<article class="index">
		<HeroSplit />
		<TrustStrip />
		<div class="index__content">
			<JobFilters />
			<div class="index__heading">
				<h2 class="index__count">
					<span class="text-violet-400">{{ totalJobs }}</span>
					<span class="text-gray-400 font-normal">open roles</span>
				</h2>
				<span class="index__updated">Updated 2 min ago</span>
			</div>
			<JobOpportunities />
		</div>
	</article>
</template>

<script setup lang="ts">
import HeroSplit from '~/components/home/hero-split.vue';
import TrustStrip from '~/components/home/trust-strip.vue';
import JobFilters from '~/components/shared/job-filters.vue';
import JobOpportunities from '~/components/job-opportunities/job-opportunities.vue';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

import { defaultMetaTags } from '~/utils/meta-tags';

useHead(defaultMetaTags);

const store = useJobOpportunitiesStore();
const totalJobs = computed(() => store.jobOpportunities?.total || 0);
</script>

<style scoped>
.index {
  @apply flex flex-col min-h-screen;

  &__content {
    @apply max-w-7xl mx-auto w-full px-8 pb-20;
  }

  &__heading {
    @apply flex items-baseline justify-between py-6;
  }

  &__count {
    @apply text-xl font-semibold text-white;
    letter-spacing: -0.6px;
  }

  &__updated {
    @apply font-mono text-gray-500;
    font-size: 11.5px;
  }
}
</style>
