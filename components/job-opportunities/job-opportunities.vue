<template>
	<dl class="job-opportunities">
		<div
			v-if="pending"
		>
			loading....
		</div>
		<div
			v-else-if="error"
		>
			{{ error }}
		</div>
		<div
			v-else
			class="job-opportunities__list"
		>
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
import { useJobOpportunitiesStore, type UseFetchReturn } from '~/store/job-opportunities';
import JobOpportunityCard from '~/components/job-opportunities/job-opportunity-card.vue';

const store = useJobOpportunitiesStore();
const config = useRuntimeConfig();

const filters = computed(() => filter(_filter => and(!!_filter, isNotEmpty(_filter)), store.filters));

const { error, pending } = await useFetch<UseFetchReturn>(
	'job_opportunities',
	{
		baseURL: config.public.baseURL,
		params: filters,
		watch: [() => store.filters],
		onResponse: ({ response }) => store.setJobOpportunities(response._data),
	},
);
</script>

<style scoped>
.job-opportunities {
	@apply w-full;

	&__list {
		@apply grid w-full gap-4;
	}
}
</style>
