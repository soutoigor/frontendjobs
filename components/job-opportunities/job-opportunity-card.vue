<template>
	<div
		class="job-card"
		:class="{
			'job-card--pending': isPendingPayment,
		}"
		@mouseenter="isHovering = true"
		@mouseleave="isHovering = false"
		@click="openJobOpportunity"
	>
		<!-- Avatar -->
		<UAvatar
			:src="jobOpportunity.company.avatar"
			:alt="jobOpportunity.company.name"
			:size="'md'"
			class="job-card__avatar"
		/>

		<!-- Main info -->
		<div class="job-card__info">
			<div class="job-card__title-row">
				<span class="job-card__title">{{ jobOpportunity.title }}</span>
				<span
					v-if="jobOpportunity.salary_minimum"
					class="job-card__salary-inline"
				>
					{{ getSalaryText(jobOpportunity.currency, jobOpportunity.salary_minimum, jobOpportunity.salary_maximum) }}
				</span>
			</div>
			<div class="job-card__meta-row">
				<span class="job-card__company">
					{{ jobOpportunity.company.name }}
				</span>
				<span class="job-card__sep">·</span>
				<span class="job-card__location">
					<FjIcon
						name="pin"
						:size="11"
						color="#6b7280"
					/>
					{{ jobOpportunity.location || 'Worldwide' }}
				</span>
			</div>
			<div class="job-card__tags">
				<UBadge
					v-for="technology in jobOpportunity.technologies?.slice(0, 4)"
					:key="technology.id"
					variant="soft"
					:label="technology.name"
					size="xs"
				/>
				<UBadge
					v-if="jobOpportunity.remote"
					color="green"
					variant="soft"
					size="xs"
				>
					◉ Remote
				</UBadge>
				<UBadge
					v-for="empType in jobOpportunity.employment_type"
					:key="empType"
					color="gray"
					variant="soft"
					size="xs"
					:label="empType"
				/>
			</div>
		</div>

		<!-- Right meta -->
		<div class="job-card__right">
			<div class="job-card__meta-badges">
				<UBadge
					v-if="isPendingPayment"
					color="yellow"
					variant="soft"
					size="xs"
					label="Payment pending"
				/>
				<span
					v-if="jobOpportunity.date_posted"
					class="job-card__posted"
				>
					{{ timeAgo(jobOpportunity.date_posted) }}
				</span>
			</div>
			<span
				v-if="jobOpportunity.applications"
				class="job-card__applicants"
			>
				{{ jobOpportunity.applications }} applied
			</span>
			<UButton
				v-if="isPublished && isHovering"
				size="sm"
				trailing-icon="i-heroicons-arrow-right-20-solid"
				:to="`/jobs/${jobOpportunity.id}`"
				class="job-card__apply-btn"
				@click.stop
			>
				Apply
			</UButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import FjIcon from '~/components/shared/fj-icon.vue';
import type { CompanyJobOpportunity } from '~/types/companies';
import type { JobOpportunity } from '~/types/job-opportunities';
import { getSalaryText, timeAgo } from '~/utils/global';

interface Props {
	jobOpportunity: JobOpportunity | CompanyJobOpportunity;
}

const props = defineProps<Props>();

const router = useRouter();

const isHovering = ref(false);
const isPendingPayment = computed(() => props.jobOpportunity.status === 'pending_payment');
const isPublished = computed(() => !props.jobOpportunity.status || props.jobOpportunity.status === 'published');

function openJobOpportunity() {
	if (isPublished.value) {
		router.push(`/jobs/${props.jobOpportunity.id}`);
	}
}
</script>

<style scoped>
.job-card {
  @apply relative grid items-center gap-4 cursor-pointer rounded-xl;
  grid-template-columns: 44px 1fr auto;
  padding: 18px 22px;
  background: rgba(15, 17, 23, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.15s;

  &:hover {
    background: rgba(20, 23, 32, 0.7);
    border-color: rgba(255, 255, 255, 0.10);
  }

  &--featured {
    background: linear-gradient(90deg, rgba(167, 139, 250, 0.03), transparent 40%);
    border-color: rgba(167, 139, 250, 0.19);
  }

  &--pending {
    @apply cursor-default;
    border-color: rgba(251, 191, 36, 0.3);
    background: rgba(251, 191, 36, 0.03);

    &:hover {
      border-color: rgba(251, 191, 36, 0.3);
    }
  }

  &__ribbon {
    @apply absolute -top-px right-4 font-mono font-bold uppercase;
    padding: 2px 8px;
    background: #a78bfa;
    color: #0b0d12;
    font-size: 9.5px;
    letter-spacing: 0.6px;
    border-radius: 0 0 4px 4px;
  }

  &__avatar {
    @apply self-start mt-0.5;
  }

  &__info {
    @apply flex flex-col gap-1.5 min-w-0;
  }

  &__title-row {
    @apply flex items-center gap-2.5 flex-wrap;
  }

  &__title {
    @apply text-white font-semibold;
    font-size: 15.5px;
    letter-spacing: -0.2px;
  }

  &__salary-inline {
    @apply font-mono text-xs px-2 py-0.5 rounded text-gray-200;
    border: 1px solid rgba(255, 255, 255, 0.10);
  }

  &__meta-row {
    @apply flex items-center gap-2 flex-wrap;
  }

  &__company {
    @apply text-gray-400 inline-flex items-center gap-1;
    font-size: 12.5px;
  }

  &__sep {
    @apply text-gray-700;
  }

  &__location {
    @apply text-gray-400 inline-flex items-center gap-1;
    font-size: 12.5px;
  }

  &__tags {
    @apply flex gap-1.5 flex-wrap mt-0.5;
  }

  &__right {
    @apply flex flex-col items-end gap-1;
  }

  &__meta-badges {
    @apply flex items-center gap-2;
  }

  &__posted {
    @apply font-mono text-gray-500;
    font-size: 11px;
  }

  &__applicants {
    @apply text-gray-500;
    font-size: 11.5px;
  }

  &__apply-btn {
    @apply mt-1;
  }
}

@media (max-width: 767px) {
  .job-card {
    grid-template-columns: 36px 1fr;
    gap: 12px;
    padding: 14px 16px;

    .job-card__right {
      grid-column: 1 / -1;
      @apply flex-row items-center justify-between;
    }
  }
}
</style>
