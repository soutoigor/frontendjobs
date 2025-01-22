<template>
	<dl class="job-opportunities">
		<div
			v-if="store.jobOpportunities?.data.length === 0"
			class="text-center"
		>
			No job opportunities found.
		</div>
	<div
		v-else-if="pending && store.jobOpportunities?.data.length === 0"
		class="job-opportunities__list"
	>
		<JobOpportunityCardSkeleton v-for="skeleton of 6" />
	</div>
	<div v-else-if="error">
		{{ error }}
	</div>
	<div v-else class="job-opportunities__list">
		<JobOpportunityCard
			v-for="jobOpportunity of store.jobOpportunities?.data"
			:key="jobOpportunity.id"
			:job-opportunity="jobOpportunity"
		/>
	</div>
	</dl>
</template>

<script setup lang="ts">
import { and, isNotEmpty, filter } from 'ramda';
import { debounce } from 'lodash-es';
import { useJobOpportunitiesStore, type UseFetchReturn } from '~/store/job-opportunities';
import JobOpportunityCard from '~/components/job-opportunities/job-opportunity-card.vue';
import JobOpportunityCardSkeleton from '~/components/job-opportunities/job-opportunity-card-skeleton.vue';

const store = useJobOpportunitiesStore();
const config = useRuntimeConfig();

const filters = computed(() => filter(_filter => and(!!_filter, isNotEmpty(_filter)), store.filters));

let previousPage = store.filters.page || 1;

const { error, pending } = await useFetch<UseFetchReturn>(
	'job_opportunities',
	{
		baseURL: config.public.baseURL,
		params: filters,
		watch: [() => store.filters],
		onResponse: ({ response }) => {
			if (store.jobOpportunities && store.filters.page && store.filters.page > previousPage) {
				store.setJobOpportunities({
					...store.jobOpportunities,
					data: [
						...store.jobOpportunities.data,
						...response._data.data,
					],
				});
			} else {
				store.setJobOpportunities(response._data);
			}
			previousPage = store.filters.page || 1;
		},
	},
);

const handleScroll = debounce(() => {
	const bottomOfWindow = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 100;
	const hasMore = (store.jobOpportunities?.current_page ?? 1) < (store.jobOpportunities?.last_page ?? 1);

	if (bottomOfWindow && hasMore) {
			store.filters.page = (store.filters.page || 1) + 1;
	}
}, 200);

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.job-opportunities {
	@apply w-full;

	&__list {
			@apply grid w-full gap-4;
	}
}
</style>
