<template>
	<div class="company-jobs">
		<div class="company-jobs__header">
			<h2 class="company-jobs__title">
				Your job posts
			</h2>
			<div
				v-if="!companyHasNoJobs"
				class="company-jobs__tabs"
			>
				<button
					v-for="tab in tabs"
					:key="tab.key"
					class="company-jobs__tab"
					:class="{ 'company-jobs__tab--active': selectedTab === tab.key }"
					@click="selectedTab = tab.key"
				>
					{{ tab.label }} ({{ tab.count }})
				</button>
			</div>
		</div>

		<div
			v-if="companyHasNoJobs"
			class="company-jobs__empty"
		>
			<div class="company-jobs__empty-copy">
				<h3>No jobs posted yet</h3>
				<p>
					Create the listing, preview exactly what candidates will see, then pay $99 through Stripe to publish it for 30 days.
				</p>
			</div>
			<UButton
				size="lg"
				icon="i-heroicons-plus-20-solid"
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
				v-for="job in filteredJobs"
				:key="job.id"
				class="company-jobs__row"
			>
				<div class="company-jobs__row-inner">
					<UAvatar
						:src="job.company?.avatar || companiesStore.userCompany?.avatar"
						:alt="job.title"
						size="sm"
					/>
					<div class="company-jobs__row-info">
						<div class="company-jobs__row-title-line">
							<span class="company-jobs__row-title">{{ job.title }}</span>
							<span
								class="company-jobs__status"
								:class="`company-jobs__status--${getStatus(job)}`"
							>
								{{ getStatusLabel(job) }}
							</span>
						</div>
						<div class="company-jobs__row-tags">
							<UBadge
								v-for="tech in (job.technologies || []).slice(0, 3)"
								:key="tech.id"
								variant="soft"
								size="xs"
								:label="tech.name"
							/>
							<span
								v-if="job.salary_minimum"
								class="company-jobs__row-salary"
							>
								{{ getSalaryText(job.currency, job.salary_minimum, job.salary_maximum) }}
							</span>
						</div>
					</div>
					<div
						v-if="job.views"
						class="company-jobs__stat"
					>
						<span class="company-jobs__stat-value">{{ job.views }}</span>
						<span class="company-jobs__stat-label">views</span>
					</div>
					<div
						v-if="job.applications !== undefined"
						class="company-jobs__stat"
					>
						<span class="company-jobs__stat-value company-jobs__stat-value--accent">{{ job.applications }}</span>
						<span class="company-jobs__stat-label">applied</span>
					</div>
					<div class="company-jobs__row-actions">
						<template v-if="job.status === 'pending_payment'">
							<UButton
								size="xs"
								icon="i-heroicons-credit-card-20-solid"
								:loading="checkoutJobId === job.id"
								@click="completePendingJob(job.id)"
							>
								Complete
							</UButton>
						</template>
						<template v-else-if="job.status === 'published'">
							<UButton
								variant="soft"
								color="gray"
								size="xs"
								icon="i-heroicons-pencil-20-solid"
								@click="editPendingJob(job)"
							>
								Edit
							</UButton>
						</template>
						<UButton
							variant="ghost"
							color="gray"
							size="xs"
							icon="i-heroicons-trash-20-solid"
							:loading="deletingJobId === job.id"
							@click="deletePendingJob(job.id)"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { isEmpty, isNil, or } from 'ramda';
import { useCompaniesStore } from '~/store/companies';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import type { JobOpportunity } from '~/types/job-opportunities';
import { getSalaryText } from '~/utils/global';

const companiesStore = useCompaniesStore();
const jobOpportunitiesStore = useJobOpportunitiesStore();
const toast = useToast();
const router = useRouter();
const deletingJobId = ref<string>();
const checkoutJobId = ref<string>();
const selectedTab = ref('all');

const companyHasNoJobs = computed(() => or(
	isEmpty(companiesStore.userCompany?.job_opportunities),
	isNil(companiesStore.userCompany?.job_opportunities),
));

const allJobs = computed(() => companiesStore.userCompany?.job_opportunities || []);

const tabs = computed(() => {
	const jobs = allJobs.value;
	const live = jobs.filter(j => j.status === 'published').length;
	const pending = jobs.filter(j => j.status === 'pending_payment').length;
	const other = jobs.length - live - pending;
	return [
		{ key: 'all', label: 'All', count: jobs.length },
		{ key: 'published', label: 'Live', count: live },
		{ key: 'pending_payment', label: 'Pending', count: pending },
		{ key: 'other', label: 'Other', count: other },
	];
});

const filteredJobs = computed(() => {
	if (selectedTab.value === 'all') return allJobs.value;
	if (selectedTab.value === 'other') {
		return allJobs.value.filter(j => j.status !== 'published' && j.status !== 'pending_payment');
	}
	return allJobs.value.filter(j => j.status === selectedTab.value);
});

function getStatus(job: JobOpportunity) {
	if (job.status === 'published') return 'live';
	if (job.status === 'pending_payment') return 'pending';
	return 'other';
}

function getStatusLabel(job: JobOpportunity) {
	if (job.status === 'published') return 'Live';
	if (job.status === 'pending_payment') return 'Payment pending';
	return job.status || 'Draft';
}

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
			title: 'Job removed',
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
  @apply w-full;

  &__header {
    @apply flex items-baseline justify-between mb-3 flex-wrap gap-3;
  }

  &__title {
    @apply text-lg font-semibold;
    color: var(--fj-text);
    letter-spacing: -0.3px;
  }

  &__tabs {
    @apply flex gap-1;
  }

  &__tab {
    @apply px-3 py-1.5 text-xs rounded-md cursor-pointer transition-colors;
    color: var(--fj-text-muted);
    border: 1px solid var(--fj-border);

    &--active {
      color: var(--fj-text);
      background: var(--fj-surface-muted);
    }
  }

  &__list {
    @apply flex flex-col gap-2.5;
  }

  &__row {
    @apply rounded-xl;
    background: var(--fj-surface);
    border: 1px solid var(--fj-border);
  }

  &__row-inner {
    @apply grid items-center gap-4 p-5;
    grid-template-columns: 40px 1fr auto auto auto;
  }

  &__row-info {
    @apply flex flex-col gap-1;
  }

  &__row-title-line {
    @apply flex items-center gap-2.5;
  }

  &__row-title {
    @apply text-sm font-semibold;
    color: var(--fj-text);
    letter-spacing: -0.2px;
  }

  &__status {
    @apply font-mono text-xs px-2 py-0.5 rounded-full;
    font-size: 10px;
    letter-spacing: 0.3px;

    &--live {
      background: rgba(190, 242, 100, 0.10);
      color: #bef264;
      border: 1px solid rgba(190, 242, 100, 0.25);
    }

    &--pending {
      background: rgba(251, 191, 36, 0.10);
      color: #fbbf24;
      border: 1px solid rgba(251, 191, 36, 0.25);
    }

    &--other {
      background: var(--fj-surface-muted);
      color: var(--fj-text-muted);
      border: 1px solid var(--fj-border);
    }
  }

  &__row-tags {
    @apply flex items-center gap-1.5 flex-wrap;
  }

  &__row-salary {
    @apply font-mono text-xs;
    color: var(--fj-text-muted);
  }

  &__stat {
    @apply text-right;
  }

  &__stat-value {
    @apply font-mono text-base font-semibold block;
    color: var(--fj-text);

    &--accent {
      @apply text-violet-400;
    }
  }

  &__stat-label {
    @apply text-xs;
    color: var(--fj-text-muted);
  }

  &__row-actions {
    @apply flex gap-1.5;
  }

  &__empty {
    @apply flex flex-col items-center gap-6 rounded-xl p-8 text-center;
    background: var(--fj-surface);
    border: 1px solid var(--fj-border);
  }

  &__empty-copy {
    @apply flex flex-col gap-2 max-w-md;

    h3 {
      @apply text-lg font-semibold;
      color: var(--fj-text);
    }

    p {
      @apply text-sm;
      color: var(--fj-text-muted);
    }
  }
}

@media (max-width: 767px) {
  .company-jobs__row-inner {
    grid-template-columns: 40px 1fr;
    gap: 12px;
  }

  .company-jobs__stat {
    grid-column: 1 / -1;
    @apply flex gap-2 text-left;
  }

  .company-jobs__row-actions {
    grid-column: 1 / -1;
  }
}
</style>
