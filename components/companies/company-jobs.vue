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
			<div
				v-for="jobOpportunity of companiesStore.userCompany?.job_opportunities"
				:key="jobOpportunity.id"
				class="company-jobs__item"
			>
				<JobOpportunityCard :job-opportunity="jobOpportunity" />
				<div
					v-if="jobOpportunity.status === 'pending_payment'"
					class="company-jobs__pending-payment"
				>
					<div>
						<p>This job is saved, but it is not public yet.</p>
						<span>Complete Stripe Checkout to publish it, or remove this unpaid attempt and post again.</span>
					</div>
					<div class="company-jobs__pending-actions">
						<UButton
							color="blue"
							variant="soft"
							size="sm"
							icon="i-heroicons-pencil"
							@click="editPendingJob(jobOpportunity)"
						>
							Edit
						</UButton>
						<UButton
							color="primary"
							size="sm"
							icon="i-heroicons-credit-card"
							:loading="checkoutJobId === jobOpportunity.id"
							@click="completePendingJob(jobOpportunity.id)"
						>
							Complete post
						</UButton>
						<UButton
							color="rose"
							variant="soft"
							size="sm"
							icon="i-heroicons-trash"
							:loading="deletingJobId === jobOpportunity.id"
							@click="deletePendingJob(jobOpportunity.id)"
						>
							Remove
						</UButton>
					</div>
				</div>
			</div>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { isEmpty, isNil, or } from 'ramda';
import { useCompaniesStore } from '~/store/companies';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import type { JobOpportunity } from '~/types/job-opportunities';
import JobOpportunityCard from '~/components/job-opportunities/job-opportunity-card.vue';

const companiesStore = useCompaniesStore();
const jobOpportunitiesStore = useJobOpportunitiesStore();
const toast = useToast();
const router = useRouter();
const deletingJobId = ref<string>();
const checkoutJobId = ref<string>();

const companyHasNoJobs = computed(() => or(
	isEmpty(companiesStore.userCompany?.job_opportunities),
	isNil(companiesStore.userCompany?.job_opportunities),
));

function editPendingJob(jobOpportunity: JobOpportunity) {
	jobOpportunitiesStore.setDraftFromJobOpportunity(jobOpportunity);
	router.push('/company/post-job');
}

async function completePendingJob(id: string) {
	try {
		checkoutJobId.value = id;
		const { checkoutUrl } = await jobOpportunitiesStore.checkoutJobOpportunity(id);
		window.location.href = checkoutUrl;
	}
	catch {
		toast.add({
			color: 'rose',
			title: 'Could not open Checkout',
			description: 'Please try again.',
		});
	}
	finally {
		checkoutJobId.value = undefined;
	}
}

async function deletePendingJob(id: string) {
	try {
		deletingJobId.value = id;
		await jobOpportunitiesStore.deleteJobOpportunity(id);
		await companiesStore.fetchUserCompany();

		toast.add({
			color: 'green',
			title: 'Pending job removed',
			description: 'You can post it again when you are ready to complete payment.',
		});
	}
	catch {
		toast.add({
			color: 'rose',
			title: 'Could not remove job',
			description: 'Please try again.',
		});
	}
	finally {
		deletingJobId.value = undefined;
	}
}
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

  &__item {
    @apply flex flex-col gap-3;
  }

  &__pending-payment {
    @apply flex flex-col gap-3 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900 dark:bg-yellow-950/20 md:flex-row md:items-center md:justify-between;

    p {
      @apply font-semibold text-yellow-900 dark:text-yellow-100;
    }

    span {
      @apply text-yellow-800 dark:text-yellow-200;
    }
  }

  &__pending-actions {
    @apply flex flex-col gap-2 sm:flex-row sm:items-center;
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
