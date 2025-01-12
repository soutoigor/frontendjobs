<template>
	<UContainer
		class="company-jobs"
		as="article"
	>
		<h1 class="company-jobs__title">
			Jobs
		</h1>
		<div
			v-if="companyHasNoJobs"
			class="company-jobs__no-jobs"
		>
			<p>No jobs posted yet</p>
			<UButton
				variant="solid"
				size="xl"
				to="/company/post-job"
			>
				Post your first job
			</UButton>
		</div>
		<div
			v-else
			class="company-jobs__list"
		>
			<JobOpportunityCard
				v-for="jobOpportunity of companiesStore.userCompany?.job_opportunities"
				:key="jobOpportunity.id"
				:job-opportunity="jobOpportunity"
			/>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { isEmpty, isNil, or } from 'ramda';
import { useCompaniesStore } from '~/store/companies';
import JobOpportunityCard from '~/components/job-opportunities/job-opportunity-card.vue';

const companiesStore = useCompaniesStore();

const companyHasNoJobs = computed(() => or(
	isEmpty(companiesStore.userCompany?.job_opportunities),
	isNil(companiesStore.userCompany?.job_opportunities),
));
</script>

<style scoped>
.company-jobs {
  @apply min-h-screen w-full;

  &__title {
    @apply text-xl md:text-2xl font-bold mb-4;
  }

  &__list {
    @apply grid w-full gap-4;
  }

  &__list-item {
    @apply bg-white p-4 rounded-lg shadow-md mb-4;
  }

  &__list-item-title {
    @apply text-lg font-bold;
  }

  &__list-item-description {
    @apply text-sm;
  }

  &__no-jobs {
    @apply flex flex-col items-center md:items-start gap-8;
  }
}
</style>
