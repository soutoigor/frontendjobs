<template>
	<UContainer
		v-if="store.jobOpportunity.id"
		class="job-opportunity-content"
	>
		<JobOpportunityContentHeader />

		<main class="job-opportunity-content__description">
			<p
				v-if="jobDescription"
				v-html="jobDescription"
			/>

			<div
				v-if="store.jobOpportunity.technologies.length"
				class="job-opportunity-content__technologies-wrapper"
			>
				<p>Technologies:</p>
				<div class="job-opportunity-content__technologies">
					<UBadge
						v-for="technology in store.jobOpportunity.technologies"
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

			<JobOpportunityCta />
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import JobOpportunityContentHeader from '~/components/job-opportunities/job-opportunity-content-header.vue';
import JobOpportunityCta from '~/components/job-opportunities/job-opportunity-cta.vue';

const store = useJobOpportunitiesStore();
const md = new MarkdownIt();

const jobDescription = computed(() => {
	return store.jobOpportunity.description
		? md.render(store.jobOpportunity.description)
		: '';
});
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
