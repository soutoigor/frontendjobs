<template>
	<div
		class="job-card"
		:class="{
			'job-card--pending': isPendingPayment,
			'job-card--featured': postingTier.key === 'featured',
			'job-card--spotlight': postingTier.key === 'spotlight',
			'job-card--static': !interactive,
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
					class="job-card__tech-badge"
				/>
				<UBadge
					v-if="jobOpportunity.remote"
					color="green"
					variant="soft"
					size="xs"
					class="job-card__remote-badge"
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
					class="job-card__employment-badge"
				/>
			</div>
		</div>

		<!-- Right meta -->
		<div class="job-card__right">
			<div class="job-card__meta-badges">
				<span
					v-if="postingTier.cardLabel"
					class="job-card__tier-badge"
					:class="`job-card__tier-badge--${postingTier.key}`"
				>
					{{ postingTier.cardLabel }}
				</span>
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
				v-if="interactive && isPublished && isHovering"
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
import { getPostingTier } from '~/utils/posting-tiers';

interface Props {
	jobOpportunity: JobOpportunity | CompanyJobOpportunity;
	interactive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	interactive: true,
});

const router = useRouter();

const isHovering = ref(false);
const isPendingPayment = computed(() => props.jobOpportunity.status === 'pending_payment');
const isPublished = computed(() => !props.jobOpportunity.status || props.jobOpportunity.status === 'published');
const postingTier = computed(() => getPostingTier(props.jobOpportunity.posting_tier));

function openJobOpportunity() {
	if (props.interactive && isPublished.value) {
		router.push(`/jobs/${props.jobOpportunity.id}`);
	}
}
</script>

<style scoped>
.job-card {
  @apply relative grid items-center gap-4 cursor-pointer rounded-xl;
  grid-template-columns: 44px 1fr auto;
  --job-card-bg: var(--fj-surface);
  --job-card-border: var(--fj-border);
  --job-card-shadow: none;
  --job-card-hover-bg: var(--fj-surface-muted);
  --job-card-hover-border: var(--fj-border-strong);
  padding: 18px 22px 18px 22px;
  background: var(--job-card-bg);
  border: 1px solid var(--job-card-border);
  box-shadow: var(--job-card-shadow);
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.15s;

  &:hover {
    background: var(--job-card-hover-bg);
    border-color: var(--job-card-hover-border);
  }

  &--featured {
    --job-card-bg: rgba(124, 58, 237, 0.055);
    --job-card-border: rgba(124, 58, 237, 0.22);
    --job-card-shadow: rgba(124, 58, 237, 0.25) 0 6px 20px -10px;
    --job-card-hover-bg: rgba(124, 58, 237, 0.08);
    --job-card-hover-border: rgba(124, 58, 237, 0.3);
  }

  &--spotlight {
    --job-card-bg: rgba(217, 119, 6, 0.07);
    --job-card-border: rgba(217, 119, 6, 0.3);
    --job-card-shadow: rgba(245, 158, 11, 0.06) 0 0 0 4px, rgba(217, 119, 6, 0.4) 0 12px 32px -12px;
    --job-card-hover-bg: rgba(217, 119, 6, 0.095);
    --job-card-hover-border: rgba(217, 119, 6, 0.4);
  }

  &--static {
    @apply cursor-default;

    &:hover {
      background: var(--job-card-bg);
      border-color: var(--job-card-border);
    }
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
    border-radius: 10px;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.72);
  }

  &__info {
    @apply flex flex-col gap-1.5 min-w-0;
  }

  &__title-row {
    @apply flex items-center gap-2.5 flex-wrap;
  }

  &__title {
    @apply font-semibold;
    color: var(--fj-text);
    font-size: 15.5px;
    letter-spacing: -0.2px;
  }

  &__salary-inline {
    @apply font-mono text-xs px-2 py-0.5 rounded;
    color: var(--fj-text);
    border: 1px solid rgba(15, 23, 42, 0.18);
    background: rgba(255, 255, 255, 0.44);
  }

  &__meta-row {
    @apply flex items-center gap-2 flex-wrap;
  }

  &__company {
    @apply inline-flex items-center gap-1;
    color: var(--fj-text-muted);
    font-size: 12.5px;
  }

  &__sep {
    @apply text-gray-700;
  }

  &__location {
    @apply inline-flex items-center gap-1;
    color: var(--fj-text-muted);
    font-size: 12.5px;
  }

  &__tags {
    @apply flex gap-1.5 flex-wrap mt-0.5;
  }

  &__tech-badge {
    color: #6d28d9;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 999px;
    font-weight: 500;
  }

  &__remote-badge {
    color: #3f7d20;
    background: rgba(63, 125, 32, 0.1);
    border-radius: 999px;
    font-weight: 500;
  }

  &__employment-badge {
    border-radius: 999px;
    font-weight: 500;
  }

  &__right {
    @apply flex flex-col items-end gap-1;
  }

  &__meta-badges {
    @apply flex items-center gap-2;
  }

  &__tier-badge {
    @apply font-mono font-semibold uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 9.5px;
    line-height: 1;
    letter-spacing: 0.7px;
  }

  &__tier-badge--featured {
    color: #6d28d9;
    background: rgba(124, 58, 237, 0.12);
    border: 1px solid rgba(124, 58, 237, 0.3);
  }

  &__tier-badge--spotlight {
    color: #92400e;
    background: rgba(217, 119, 6, 0.14);
    border: 1px solid rgba(217, 119, 6, 0.36);
  }

  &__posted {
    @apply font-mono;
    color: var(--fj-text-muted);
    font-size: 11px;
  }

  &__applicants {
    color: var(--fj-text-muted);
    font-size: 11.5px;
  }

  &__apply-btn {
    @apply mt-1;
  }
}

:global(html.dark) {
  .job-card {
    --job-card-bg: rgba(15, 17, 23, 0.6);
    --job-card-border: rgba(255, 255, 255, 0.06);
    --job-card-hover-bg: rgba(24, 27, 36, 0.72);
    --job-card-hover-border: rgba(255, 255, 255, 0.12);

    &--featured {
      --job-card-bg: rgba(167, 139, 250, 0.1);
      --job-card-border: rgba(167, 139, 250, 0.26);
      --job-card-shadow: rgba(167, 139, 250, 0.35) 0 8px 24px -12px;
      --job-card-hover-bg: rgba(167, 139, 250, 0.14);
      --job-card-hover-border: rgba(167, 139, 250, 0.36);
    }

    &--spotlight {
      --job-card-bg: rgba(251, 191, 36, 0.105);
      --job-card-border: rgba(251, 191, 36, 0.32);
      --job-card-shadow: rgba(251, 191, 36, 0.06) 0 0 0 4px, rgba(251, 191, 36, 0.4) 0 14px 36px -12px;
      --job-card-hover-bg: rgba(251, 191, 36, 0.14);
      --job-card-hover-border: rgba(251, 191, 36, 0.42);
    }

    &__salary-inline {
      border-color: rgba(255, 255, 255, 0.16);
      background: rgba(255, 255, 255, 0.04);
    }

    &__tech-badge {
      color: #c4b5fd;
      background: rgba(167, 139, 250, 0.14);
    }

    &__remote-badge {
      color: #86efac;
      background: rgba(74, 222, 128, 0.12);
    }

    &__tier-badge--featured {
      color: #c4b5fd;
      background: rgba(167, 139, 250, 0.16);
      border-color: rgba(167, 139, 250, 0.34);
    }

    &__tier-badge--spotlight {
      color: #fcd34d;
      background: rgba(251, 191, 36, 0.16);
      border-color: rgba(251, 191, 36, 0.36);
    }
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
