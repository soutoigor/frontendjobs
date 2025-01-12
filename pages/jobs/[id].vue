<template>
	<article class="job-opportunity">
		<div v-if="pending">
			loading....
		</div>
		<div v-else-if="error">
			{{ error }}
		</div>
		<main
			v-else-if="data?.job_opportunity.id"
			class="job-opportunity__content"
		>
			<JobOpportunityContent
				class="job-opportunity__description"
				:job-opportunity="data.job_opportunity"
			/>
		</main>
	</article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JobOpportunityContent from '~/components/job-opportunities/job-opportunity-content.vue';
import type { JobOpportunity } from '~/types/job-opportunities';

const route = useRoute();
const config = useRuntimeConfig();

const jobId = computed(() => route.params.id);

const { pending, error, data } = await useAsyncData(
	'job-opportunity',
	 () => $fetch<{ job_opportunity: JobOpportunity }>(
    `job_opportunities/${jobId.value}`,
    { baseURL: config.public.baseURL },
	),
	{
		server: false,
		watch: [jobId],
	},
);
</script>

<style scoped>
.job-opportunity {
  @apply w-full pt-20;

  &__content {
    @apply flex justify-center;
  }

	&__description {
		@apply w-full max-w-4xl;
	}
}
</style>
