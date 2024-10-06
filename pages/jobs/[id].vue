<template>
	<article class="job-opportunity">
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
		<main
			v-else
			class="job-opportunity__content"
		>
			<JobOpportunityContent class="job-opportunity__description" />
		</main>
	</article>
</template>

<script setup lang="ts">
import { useJobOpportunitiesStore, type UseFetchReturn } from '~/store/job-opportunities';
import JobOpportunityContent from '~/components/job-opportunities/job-opportunity-content.vue';

const route = useRoute();

const store = useJobOpportunitiesStore();
const config = useRuntimeConfig();

const { error, pending } = await useFetch<UseFetchReturn>(
  `job_opportunities/${route.params.id}`,
  {
  	baseURL: config.public.baseURL,
  	watch: [() => route.params.id],
  	onResponse: ({ response: { _data } }) => store.setJobOpportunity(_data.job_opportunity),
  },
);
</script>

<style scoped>
.job-opportunity {
  @apply w-full;

  &__content {
    @apply flex justify-center;
  }

	&__description {
		@apply w-full max-w-4xl;
	}
}
</style>
