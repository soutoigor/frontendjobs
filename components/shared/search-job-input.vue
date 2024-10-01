<template>
	<UInput
		autofocus
		:model-value="search"
		class="search-job-input"
		icon="i-heroicons-magnifying-glass-20-solid"
		size="xl"
		color="purple"
		:trailing="false"
		placeholder="Search..."
		@input="handleSearchJobInput($event.target.value)"
	/>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();

const search = ref('');

const handleSearchJobInput = useDebounceFn((value: string) => {
	store.updateFilters({ search: value });
}, 500);
</script>

<style scoped>
.search-job-input {
  @apply w-full bg-gray-900 rounded-lg;
}
</style>
