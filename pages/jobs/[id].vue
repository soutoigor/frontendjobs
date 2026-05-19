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
		watch: [jobId],
	},
);

const job = computed(() => data.value?.job_opportunity);
const pageUrl = computed(() => `${config.public.siteUrl}${route.path}`);

function stripHtml(value?: string) {
	return (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function jobPostingJsonLd(jobOpportunity: JobOpportunity) {
	const salaryMinimum = Number(jobOpportunity.salary_minimum);
	const salaryMaximum = Number(jobOpportunity.salary_maximum || jobOpportunity.salary_minimum);

	return {
		'@context': 'https://schema.org',
		'@type': 'JobPosting',
		title: jobOpportunity.title,
		description: stripHtml(jobOpportunity.description),
		datePosted: jobOpportunity.date_posted,
		employmentType: jobOpportunity.employment_type?.map(type => type.toUpperCase().replace(/[-\s]/g, '_')),
		hiringOrganization: {
			'@type': 'Organization',
			name: jobOpportunity.company.name,
			logo: jobOpportunity.company.avatar || undefined,
		},
		jobLocationType: jobOpportunity.remote ? 'TELECOMMUTE' : undefined,
		applicantLocationRequirements: jobOpportunity.remote
			? { '@type': 'Country', name: jobOpportunity.location || 'Worldwide' }
			: undefined,
		jobLocation: !jobOpportunity.remote
			? {
					'@type': 'Place',
					address: {
						'@type': 'PostalAddress',
						addressLocality: jobOpportunity.location || 'Worldwide',
					},
				}
			: undefined,
		baseSalary: salaryMinimum
			? {
					'@type': 'MonetaryAmount',
					currency: jobOpportunity.currency,
					value: {
						'@type': 'QuantitativeValue',
						minValue: salaryMinimum,
						maxValue: salaryMaximum,
						unitText: 'YEAR',
					},
				}
			: undefined,
		url: pageUrl.value,
	};
}

useHead(() => {
	if (!job.value) {
		return {};
	}

	return {
		...generateDynamicMetaTags({
			title: `${job.value.title} at ${job.value.company.name} - Frontend Jobs`,
			description: `Apply for ${job.value.title} at ${job.value.company.name}. Discover frontend development jobs with salary ranges upfront.`,
			url: pageUrl.value,
			image: job.value.company.avatar || `${config.public.siteUrl}/frontend-jobs-icon.png`,
			keywords: `${job.value.title}, ${job.value.company.name}, frontend jobs, development opportunities`,
		}),
		script: [
			{
				type: 'application/ld+json',
				children: JSON.stringify(jobPostingJsonLd(job.value)),
			},
		],
	};
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
