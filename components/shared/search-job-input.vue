<template>
	<UInput
		autofocus
		:model-value="search"
		class="search-job-input"
		icon="i-heroicons-magnifying-glass-20-solid"
		size="xl"
		:trailing="false"
		placeholder="Search by role, company, or stack…"
		@input="handleSearchJobInput(($event.target as HTMLInputElement).value)"
	/>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();

const search = defineModel<string>({ default: '' });

const updateSearchFilter = useDebounceFn((value: string) => {
	store.updateFilters({ search: value, page: 1 });
}, 500);

function handleSearchJobInput(value: string) {
	search.value = value;
	updateSearchFilter(value);
}
</script>

<style scoped>
.search-job-input {
  @apply w-full rounded-lg;
}
</style>
