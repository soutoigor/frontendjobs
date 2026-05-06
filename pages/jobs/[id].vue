<template>
	<article class="job-detail">
		<AppLoading v-if="pending" />
		<div
			v-else-if="error"
			class="text-center text-red-400 py-20"
		>
			{{ error }}
		</div>
		<main
			v-else-if="data?.job_opportunity.id"
			class="job-detail__content"
		>
			<NuxtLink
				to="/"
				class="job-detail__back"
			>
				← Back to all jobs
			</NuxtLink>
			<JobOpportunityContent
				:job-opportunity="data.job_opportunity"
			/>
		</main>
	</article>
</template>

<script setup lang="ts">
import JobOpportunityContent from '~/components/job-opportunities/job-opportunity-content.vue';
import AppLoading from '~/components/shared/app-loading.vue';
import { generateDynamicMetaTags } from '~/utils/meta-tags';
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

watch(data, (newValue) => {
	if (newValue) {
		useHead(generateDynamicMetaTags({
			title: `${newValue.job_opportunity?.title} at ${newValue.job_opportunity?.company.name} – Frontend Jobs`,
			description: `Apply for ${newValue.job_opportunity?.title} at ${newValue.job_opportunity?.company.name}. Discover great frontend development opportunities.`,
			url: route.fullPath,
			image: newValue.job_opportunity?.company.avatar || '',
			keywords: `${newValue.job_opportunity?.title}, ${newValue.job_opportunity?.company.name}, frontend jobs, development opportunities`,
		}));
	}
});
</script>

<style scoped>
.job-detail {
  @apply w-full;

  &__content {
    @apply max-w-5xl mx-auto px-8 py-8;
  }

  &__back {
    @apply inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6;
  }
}
</style>
