<template>
	<UContainer class="job-opportunity-content">
		<JobOpportunityContentHeader :job-opportunity="jobOpportunity" />

		<main class="job-opportunity-content__description">
			<p
				v-if="jobOpportunity.description"
				v-html="jobOpportunity.description"
			/>

			<div
				v-if="jobOpportunity.technologies.length"
				class="job-opportunity-content__technologies-wrapper"
			>
				<p>Technologies:</p>
				<div class="job-opportunity-content__technologies">
					<UBadge
						v-for="technology in jobOpportunity.technologies"
						:key="technology.id"
						variant="soft"
						:label="technology.name"
					/>
				</div>
			</div>
		</main>

		<div class="job-opportunity-content__cta-wrapper">
			<h3 class="job-opportunity-content__cta-title">
				Did you like this job?
			</h3>

			<JobOpportunityCta :job-opportunity="jobOpportunity" />
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import JobOpportunityContentHeader from '~/components/job-opportunities/job-opportunity-content-header.vue';
import JobOpportunityCta from '~/components/job-opportunities/job-opportunity-cta.vue';
import type { JobOpportunityDraft } from '~/types/job-opportunities';

interface Props {
	jobOpportunity: JobOpportunityDraft;
}

const props = defineProps<Props>();
</script>

<style scoped>
.job-opportunity-content {
  @apply w-full flex flex-col items-stretch gap-12;

  &__description {
    @apply flex-1;
  }

	&__cta-wrapper {
		@apply flex flex-col items-center gap-4 py-12 px-4 rounded-lg border-purple-600 border;
	}

	&__cta-title {
		@apply text-2xl font-semibold;
	}

	&__technologies-wrapper {
		@apply flex flex-col mt-8 font-semibold gap-2;
	}

	&__technologies {
		@apply flex gap-4;
	}
}
</style>
