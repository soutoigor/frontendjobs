<template>
	<div class="job-filters">
		<div class="job-filters__wrapper">
			<USelectMenu
				v-model="store.filters.technologies"
				class="job-filters__filter"
				:options="technologies"
				multiple
				placeholder="Technologies"
				:loading="isLoadingTechnologies"
				value-attribute="id"
				option-attribute="name"
			/>
			<UInputMenu
				v-model="store.filters.location"
				class="job-filters__filter"
				:options="locations"
				placeholder="Location"
			/>
			<UInputMenu
				v-model="store.filters.seniority"
				class="job-filters__filter"
				:options="seniorities"
				placeholder="Seniority"
			/>
			<UInputMenu
				v-model="store.filters.employment_type"
				class="job-filters__filter"
				:options="employmentTypes"
				placeholder="Employment type"
			/>
			<UCheckbox
				v-model="store.filters.remote"
				name="remote"
				label="Remote"
				class="justify-self-end"
			/>
		</div>
		<div class="job-filters__labels-wrapper">
			<div class="job-filters__labels">
				<UBadge
					v-for="label of store.filtersLabel"
					:key="label"
				>
					<span v-text="label" />
					<UButton
						:padded="false"
						color="white"
						variant="link"
						icon="i-heroicons-x-mark-20-solid"
						@click="store.removeFilter(label)"
					/>
				</UBadge>
			</div>
			<UButton
				v-if="store.filtersLabel.length"
				trailing
				label="Clear filters"
				variant="outline"
				icon="i-heroicons-x-mark-20-solid"
				@click="store.resetFilters"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useFilterOptions } from '~/composables/use-filter-options';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();
const {
	employmentTypes,
	isLoadingTechnologies,
	locations,
	seniorities,
	technologies,
} = useFilterOptions();
</script>

<style scoped>
.job-filters {
	@apply w-full flex flex-col gap-4;

	&__wrapper {
		@apply w-full grid grid-cols-1 md:grid-cols-5 items-center gap-4;
	}

	&__labels-wrapper {
		@apply w-full flex flex-col items-end md:flex-row md:items-center gap-4;
	}

	&__labels {
		@apply w-full flex justify-start gap-4 flex-wrap;
	}

	&__filter {
		@apply rounded-lg bg-gray-900;
	}
}
</style>
