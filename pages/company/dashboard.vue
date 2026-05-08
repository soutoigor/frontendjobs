<template>
	<div class="dashboard">
		<!-- Company header -->
		<div
			v-if="companiesStore.userCompany"
			class="dashboard__header"
		>
			<CompanyCard :company="companiesStore.userCompany">
				<template #action>
					<div class="dashboard__header-actions">
						<UButton
							variant="soft"
							color="gray"
							icon="i-heroicons-pencil-20-solid"
							to="/company/edit"
						>
							Edit profile
						</UButton>
						<UButton
							icon="i-heroicons-plus-20-solid"
							to="/company/post-job"
						>
							Post a new role
						</UButton>
					</div>
				</template>
			</CompanyCard>
		</div>

		<!-- Stats row -->
		<div class="dashboard__stats">
			<StatCard
				:value="totalViews.toLocaleString()"
				label="Total views"
			/>
			<StatCard
				:value="totalApplications.toString()"
				label="Applications"
			/>
			<StatCard
				:value="conversionRate"
				label="Conversion"
			/>
			<StatCard
				:value="totalSpent"
				label="Spent"
			/>
		</div>

		<!-- Job posts -->
		<CompanyJobs />
	</div>
</template>

<script setup lang="ts">
import CompanyCard from '~/components/companies/company-card.vue';
import CompanyJobs from '~/components/companies/company-jobs.vue';
import StatCard from '~/components/shared/stat-card.vue';
import { useCompaniesStore } from '~/store/companies';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import { formatAmountCents, getPostingTier } from '~/utils/posting-tiers';

definePageMeta({
	layout: 'company',
});

const companiesStore = useCompaniesStore();
const jobOpportunitiesStore = useJobOpportunitiesStore();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const totalViews = computed(() => {
	const jobs = companiesStore.userCompany?.job_opportunities || [];
	return jobs.reduce((sum, j) => sum + (j.views || 0), 0);
});

const totalApplications = computed(() => {
	const jobs = companiesStore.userCompany?.job_opportunities || [];
	return jobs.reduce((sum, j) => sum + (j.applications || 0), 0);
});

const conversionRate = computed(() => {
	if (!totalViews.value) return '0%';
	return `${((totalApplications.value / totalViews.value) * 100).toFixed(1)}%`;
});

const totalSpent = computed(() => {
	const jobs = companiesStore.userCompany?.job_opportunities || [];
	const spentCents = jobs.reduce((sum, job) => {
		if (job.paid_amount_cents !== undefined && job.paid_amount_cents !== null) {
			return sum + job.paid_amount_cents;
		}

		if (job.status === 'published') {
			return sum + getPostingTier(job.posting_tier).amountCents;
		}

		return sum;
	}, 0);

	return formatAmountCents(spentCents);
});

onMounted(async () => {
	if (route.query.payment === 'success') {
		await router.replace('/company/dashboard');
		jobOpportunitiesStore.clearDraftJobOpportunity();
		await companiesStore.fetchUserCompany();

		toast.add({
			id: 'payment-success',
			color: 'green',
			title: 'Payment received',
			description: 'Your job post is being published.',
		});

		return;
	}

	if (route.query.payment === 'cancelled') {
		await router.replace('/company/dashboard');

		toast.add({
			id: 'payment-cancelled',
			color: 'yellow',
			title: 'Payment not completed',
			description: 'You can edit, complete, or remove the pending job below.',
		});
	}
});
</script>

<style scoped>
.dashboard {
  @apply min-h-screen w-full flex flex-col gap-8;

  &__header {
    @apply mb-2;
  }

  &__header-actions {
    @apply flex gap-2;
  }

  &__stats {
    @apply grid grid-cols-2 md:grid-cols-4 gap-3.5;
  }
}
</style>
