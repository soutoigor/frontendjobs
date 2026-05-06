<template>
	<div class="job-content">
		<!-- Top card: job header -->
		<div class="job-content__header-card">
			<div class="job-content__header-grid">
				<UAvatar
					v-if="jobOpportunityFormatted.company"
					:src="jobOpportunityFormatted.company.avatar"
					:alt="jobOpportunityFormatted.company?.name"
					size="xl"
					class="job-content__avatar"
				/>
				<div class="job-content__header-info">
					<div class="job-content__company-row">
						<span class="job-content__company-name">
							{{ jobOpportunityFormatted.company?.name }}
						</span>
						<VerifiedBadge
							v-if="jobOpportunityFormatted.company"
							show-label
						/>
					</div>
					<h1 class="job-content__title">
						{{ jobOpportunityFormatted.title }}
					</h1>
					<div class="job-content__meta">
						<span class="job-content__meta-item">
							<FjIcon
								name="pin"
								:size="13"
								color="#6b7280"
							/>
							{{ jobOpportunityFormatted.location || 'Worldwide' }}
						</span>
						<span
							v-for="empType in jobOpportunityFormatted.employment_type"
							:key="empType"
							class="job-content__meta-item"
						>
							<FjIcon
								name="clock"
								:size="13"
								color="#6b7280"
							/>
							{{ empType }}
						</span>
						<span
							v-if="jobOpportunityFormatted.date_posted"
							class="job-content__meta-item"
						>
							<FjIcon
								name="globe"
								:size="13"
								color="#6b7280"
							/>
							Posted {{ timeAgo(jobOpportunityFormatted.date_posted) }}
						</span>
						<span
							v-if="jobOpportunityFormatted.applications"
							class="job-content__meta-item"
						>
							<FjIcon
								name="user"
								:size="13"
								color="#6b7280"
							/>
							{{ jobOpportunityFormatted.applications }} applied
						</span>
					</div>
				</div>
				<div
					v-if="jobOpportunityFormatted.salary_minimum"
					class="job-content__salary"
				>
					<div class="job-content__salary-amount">
						{{ getSalaryText(jobOpportunityFormatted.currency, jobOpportunityFormatted.salary_minimum, jobOpportunityFormatted.salary_maximum) }}
					</div>
					<span class="job-content__salary-period">{{ jobOpportunityFormatted.currency }} / year</span>
				</div>
			</div>

			<!-- Tags -->
			<div class="job-content__tags">
				<UBadge
					v-for="technology in jobOpportunityFormatted.technologies"
					:key="typeof technology === 'string' ? technology : technology.id"
					variant="soft"
					:label="typeof technology === 'string' ? technology : technology.name"
				/>
				<UBadge
					v-if="jobOpportunityFormatted.remote"
					color="green"
					variant="soft"
				>
					◉ Remote
				</UBadge>
			</div>

			<!-- Actions -->
			<div class="job-content__actions">
				<JobOpportunityCta :job-opportunity="jobOpportunityFormatted" />
			</div>
		</div>

		<!-- Two-column layout -->
		<div class="job-content__body">
			<!-- Main content -->
			<div class="job-content__main">
				<h3 class="job-content__section-label">
					About the role
				</h3>
				<div
					v-if="jobOpportunityFormatted.description"
					class="job-content__description prose"
					v-html="jobOpportunityFormatted.description"
				/>
				<div
					v-if="jobOpportunityFormatted.technologies?.length"
					class="job-content__tech-section"
				>
					<h3 class="job-content__section-label">
						Technologies
					</h3>
					<div class="job-content__tech-list">
						<UBadge
							v-for="technology in jobOpportunityFormatted.technologies"
							:key="typeof technology === 'string' ? technology : technology.id"
							variant="soft"
							:label="typeof technology === 'string' ? technology : technology.name"
						/>
					</div>
				</div>
			</div>

			<!-- Sidebar -->
			<div class="job-content__sidebar">
				<!-- Company card -->
				<div
					v-if="jobOpportunityFormatted.company"
					class="job-content__sidebar-card"
				>
					<h4 class="job-content__sidebar-label">
						About {{ jobOpportunityFormatted.company.name }}
					</h4>
					<div class="job-content__sidebar-company">
						<UAvatar
							:src="jobOpportunityFormatted.company.avatar"
							:alt="jobOpportunityFormatted.company.name"
							size="sm"
						/>
						<div>
							<div class="job-content__sidebar-company-name">
								{{ jobOpportunityFormatted.company.name }}
							</div>
							<div class="text-xs text-gray-500">
								{{ jobOpportunityFormatted.company.industry || 'Technology' }}
							</div>
						</div>
					</div>
				</div>

				<!-- Quick facts -->
				<div class="job-content__sidebar-card">
					<h4 class="job-content__sidebar-label">
						Quick facts
					</h4>
					<div class="job-content__facts">
						<div
							v-if="jobOpportunityFormatted.salary_minimum"
							class="job-content__fact-row"
						>
							<span class="text-gray-500">Salary</span>
							<span class="text-gray-200 font-mono">
								{{ getSalaryText(jobOpportunityFormatted.currency, jobOpportunityFormatted.salary_minimum, jobOpportunityFormatted.salary_maximum) }}
							</span>
						</div>
						<div
							v-if="jobOpportunityFormatted.seniority"
							class="job-content__fact-row"
						>
							<span class="text-gray-500">Seniority</span>
							<span class="text-gray-200">{{ jobOpportunityFormatted.seniority }}</span>
						</div>
						<div class="job-content__fact-row">
							<span class="text-gray-500">Remote</span>
							<span class="text-gray-200">{{ jobOpportunityFormatted.remote ? 'Yes' : 'No' }}</span>
						</div>
						<div
							v-if="jobOpportunityFormatted.technologies?.length"
							class="job-content__fact-row"
						>
							<span class="text-gray-500">Stack</span>
							<span class="text-gray-200 font-mono text-right">
								{{ jobOpportunityFormatted.technologies.slice(0, 3).map(t => t.name || t).join(' · ') }}
							</span>
						</div>
					</div>
				</div>

				<!-- Job alerts -->
				<div class="job-content__sidebar-card job-content__sidebar-card--accent">
					<div class="job-content__alert-label">
						Job alerts
					</div>
					<p class="job-content__alert-text">
						Get similar roles in your inbox weekly.
					</p>
					<UButton
						size="sm"
						block
						icon="i-heroicons-envelope-20-solid"
					>
						Subscribe
					</UButton>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import FjIcon from '~/components/shared/fj-icon.vue';
import VerifiedBadge from '~/components/shared/verified-badge.vue';
import JobOpportunityCta from '~/components/job-opportunities/job-opportunity-cta.vue';
import { useCompaniesStore } from '~/store/companies';
import { getSalaryText, timeAgo } from '~/utils/global';
import type { JobOpportunityDraft } from '~/types/job-opportunities';

interface Props {
	jobOpportunity: JobOpportunityDraft;
}

const props = defineProps<Props>();

const companiesStore = useCompaniesStore();

const jobOpportunityFormatted = computed(() => {
	const job = { ...props.jobOpportunity };

	if (!job.company) {
		job.company = companiesStore.userCompany;
	}

	return job;
});
</script>

<style scoped>
.job-content {
  @apply flex flex-col gap-5;

  &__header-card {
    @apply rounded-xl p-7;
    background: rgba(15, 17, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(8px);
  }

  &__header-grid {
    @apply grid gap-5 items-start;
    grid-template-columns: 64px 1fr auto;
  }

  &__avatar {
    @apply mt-1;
  }

  &__company-row {
    @apply flex items-center gap-2.5 mb-1.5;
  }

  &__company-name {
    @apply text-sm text-gray-400 font-medium;
  }

  &__title {
    @apply text-white font-bold leading-tight mb-3.5;
    font-size: 32px;
    letter-spacing: -1px;
  }

  &__meta {
    @apply flex gap-3.5 text-sm text-gray-400 flex-wrap;
  }

  &__meta-item {
    @apply inline-flex items-center gap-1.5;
  }

  &__salary {
    @apply flex flex-col items-end gap-1;
  }

  &__salary-amount {
    @apply font-mono text-xl font-semibold text-white;
  }

  &__salary-period {
    @apply text-xs text-gray-500;
  }

  &__tags {
    @apply flex gap-1.5 flex-wrap mt-5;
  }

  &__actions {
    @apply flex gap-2.5 mt-5 pt-5;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  /* Two-column body */
  &__body {
    @apply grid gap-5;
    grid-template-columns: 1fr 280px;
  }

  &__main {
    @apply rounded-xl p-7;
    background: rgba(15, 17, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__section-label {
    @apply text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3.5;
  }

  &__description {
    @apply text-gray-300 leading-relaxed;
    font-size: 15px;

    :deep(h2), :deep(h3) {
      @apply text-white font-semibold mt-5 mb-2;
    }

    :deep(ul), :deep(ol) {
      @apply pl-5 space-y-1;
    }

    :deep(p) {
      @apply mb-4;
    }
  }

  &__tech-section {
    @apply mt-6 pt-6;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  &__tech-list {
    @apply flex gap-2 flex-wrap;
  }

  /* Sidebar */
  &__sidebar {
    @apply flex flex-col gap-3;
  }

  &__sidebar-card {
    @apply rounded-xl p-5;
    background: rgba(15, 17, 23, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.06);

    &--accent {
      background: linear-gradient(180deg, rgba(167, 139, 250, 0.06), transparent);
      border-color: rgba(167, 139, 250, 0.19);
    }
  }

  &__sidebar-label {
    @apply text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3;
  }

  &__sidebar-company {
    @apply flex items-center gap-2.5 mb-3;
  }

  &__sidebar-company-name {
    @apply text-sm font-semibold text-white;
  }

  &__facts {
    @apply flex flex-col gap-3;
  }

  &__fact-row {
    @apply flex justify-between text-xs;
  }

  &__alert-label {
    @apply font-mono text-xs text-violet-400 uppercase tracking-wider mb-2;
  }

  &__alert-text {
    @apply text-sm text-gray-200 mb-3 leading-relaxed;
  }
}

@media (max-width: 767px) {
  .job-content__header-grid {
    grid-template-columns: 48px 1fr;
  }

  .job-content__salary {
    grid-column: 1 / -1;
    @apply flex-row items-center gap-2;
  }

  .job-content__body {
    grid-template-columns: 1fr;
  }
}
</style>
