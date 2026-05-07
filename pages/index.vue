<template>
	<article class="index">
		<HeroSplit />
		<TrustStrip />
		<div class="index__content">
			<JobFilters />
			<div class="index__heading">
				<h2 class="index__count">
					<span class="text-violet-400">{{ totalJobs }}</span>
					<span class="index__count-label">open roles</span>
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
import type { IndexJobOpportunitiesResponse } from '~/types/job-opportunities';

import { defaultMetaTags } from '~/utils/meta-tags';

useHead(defaultMetaTags);

const store = useJobOpportunitiesStore();
const config = useRuntimeConfig();
const totalJobs = computed(() => store.totalJobOpportunities ?? store.jobOpportunities?.total ?? 0);

await useFetch<IndexJobOpportunitiesResponse>(
	'job_opportunities',
	{
		baseURL: config.public.baseURL,
		key: 'job-opportunities-total',
		onResponse: ({ response }) => {
			store.setTotalJobOpportunities(response._data.total);
		},
	},
);
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
    @apply inline-flex items-baseline gap-2 text-xl font-semibold;
    color: var(--fj-text);
    letter-spacing: -0.6px;
  }

  &__count-label {
    @apply font-normal;
    color: var(--fj-text-muted);
  }

  &__updated {
    @apply font-mono;
    color: var(--fj-text-muted);
    font-size: 11.5px;
  }
}
</style>
