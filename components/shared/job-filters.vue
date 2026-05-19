<template>
	<div class="job-filters">
		<div class="job-filters__row">
			<div class="job-filters__dropdowns">
				<USelectMenu
					v-model="store.filters.technologies"
					class="job-filters__filter"
					aria-label="Filter by technology stack"
					:options="technologies"
					multiple
					placeholder="Stack"
					:loading="isLoadingTechnologies"
					value-attribute="id"
					option-attribute="name"
				/>
				<UInputMenu
					v-model="store.filters.location"
					class="job-filters__filter"
					aria-label="Filter by location"
					:options="locations"
					placeholder="Location"
				/>
				<UInputMenu
					v-model="store.filters.seniority"
					class="job-filters__filter"
					aria-label="Filter by seniority"
					:options="seniorities"
					placeholder="Seniority"
				/>
				<UInputMenu
					v-model="store.filters.employment_type"
					class="job-filters__filter"
					aria-label="Filter by employment type"
					:options="employmentTypes"
					placeholder="Type"
				/>
				<label class="job-filters__remote-toggle">
					<input
						v-model="store.filters.remote"
						type="checkbox"
						class="sr-only"
					>
					<span
						class="job-filters__remote-check"
						:class="{ 'job-filters__remote-check--active': store.filters.remote }"
					>
						<FjIcon
							v-if="store.filters.remote"
							name="check"
							:size="9"
							color="#0b0d12"
						/>
					</span>
					<span
						class="job-filters__remote-label"
						:class="{ 'job-filters__remote-label--active': store.filters.remote }"
					>Remote only</span>
				</label>
			</div>
		</div>

		<div
			v-if="store.filtersLabel.length"
			class="job-filters__labels-wrapper"
		>
			<div class="job-filters__labels">
				<UBadge
					v-for="label of store.filtersLabel"
					:key="label"
					variant="soft"
				>
					<span v-text="label" />
					<UButton
						:padded="false"
						color="white"
						variant="link"
						icon="i-heroicons-x-mark-20-solid"
						size="2xs"
						:aria-label="`Remove ${label} filter`"
						@click="store.removeFilter(label)"
					/>
				</UBadge>
			</div>
			<UButton
				trailing
				label="Clear filters"
				variant="ghost"
				color="gray"
				size="xs"
				icon="i-heroicons-x-mark-20-solid"
				@click="store.resetFilters"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import FjIcon from '~/components/shared/fj-icon.vue';
import { useFilterOptions } from '~/composables/use-filter-options';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();
const { track } = useAnalytics();
const {
	employmentTypes,
	isLoadingTechnologies,
	locations,
	seniorities,
	technologies,
} = useFilterOptions();

watch(
	() => ({ ...store.filters }),
	(filters, previousFilters) => {
		if (!previousFilters) {
			return;
		}

		track('Filter Change', {
			props: {
				location: filters.location || '',
				remote: filters.remote,
				seniority: filters.seniority || '',
				employment_type: filters.employment_type || '',
				technologies_count: filters.technologies.length,
			},
		});
	},
	{ deep: true },
);

onMounted(() => {
	const labels = [
		'Filter by technology stack',
		'Filter by location',
		'Filter by seniority',
		'Filter by employment type',
	];

	document.querySelectorAll<HTMLElement>('.job-filters__filter button[aria-haspopup]').forEach((button, index) => {
		button.setAttribute('aria-label', labels[index] || 'Open filter options');
	});
});
</script>

<style scoped>
.job-filters {
  @apply w-full flex flex-col gap-4;
  padding: 20px 0;
  border-bottom: 1px solid var(--fj-border);

  &__row {
    @apply flex items-center gap-2.5 flex-wrap;
  }

  &__dropdowns {
    @apply flex gap-2 flex-1 flex-wrap items-center;
  }

  &__filter {
    @apply min-w-[130px];
  }

  &__remote-toggle {
    @apply inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer;
    background: var(--fj-success-bg);
    border: 1px solid var(--fj-success-border);
  }

  &__remote-check {
    @apply w-3.5 h-3.5 rounded inline-flex items-center justify-center;
    border: 1px solid var(--fj-border-strong);

    &--active {
      background: var(--fj-success-dot);
      border-color: var(--fj-success-dot);
    }
  }

  &__remote-label {
    @apply text-xs font-medium;
    color: var(--fj-text-muted);

    &--active {
      color: var(--fj-success-text);
    }
  }

  &__labels-wrapper {
    @apply w-full flex flex-col items-end md:flex-row md:items-center gap-4;
  }

  &__labels {
    @apply w-full flex justify-start gap-2 flex-wrap;
  }
}
</style>
