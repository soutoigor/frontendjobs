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
			<div class="company-jobs__empty-copy">
				<h2>No jobs posted yet</h2>
				<p>
					Create the listing, preview exactly what candidates will see, then pay $99 through Stripe to publish it for 30 days.
				</p>
			</div>
			<ul class="company-jobs__empty-steps">
				<li>1. Write the job details and application destination.</li>
				<li>2. Review the public preview before checkout.</li>
				<li>3. Publish automatically after payment succeeds.</li>
			</ul>
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
    @apply flex flex-col items-center md:items-start gap-6 rounded-md border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900;
  }

  &__empty-copy {
    @apply flex max-w-2xl flex-col gap-2 text-center md:text-left;

    h2 {
      @apply text-lg font-semibold;
    }

    p {
      @apply text-sm text-gray-500;
    }
  }

  &__empty-steps {
    @apply flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300;
  }
}
</style>
