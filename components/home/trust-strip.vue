<template>
	<section
		v-if="companies.length > 0"
		class="trust-strip"
	>
		<div class="trust-strip__label">
			Recently hiring on frontendjobs
		</div>
		<div class="trust-strip__logos">
			<div
				v-for="company in companies"
				:key="company.name"
				class="trust-strip__company"
			>
				<UAvatar
					:src="company.avatar"
					:alt="company.name"
					size="xs"
				/>
				<span>{{ company.name }}</span>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useJobOpportunitiesStore } from '~/store/job-opportunities';

const store = useJobOpportunitiesStore();

const companies = computed(() => {
	const jobs = store.jobOpportunities?.data || [];
	const seen = new Set<string>();
	const result: Array<{ name: string; avatar: string }> = [];

	for (const job of jobs) {
		if (!seen.has(job.company.name) && result.length < 6) {
			seen.add(job.company.name);
			result.push({
				name: job.company.name,
				avatar: job.company.avatar || '',
			});
		}
	}

	return result;
});
</script>

<style scoped>
.trust-strip {
  @apply py-8 max-w-7xl mx-auto px-8;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &__label {
    @apply font-mono text-gray-500 uppercase text-center mb-5 tracking-widest;
    font-size: 10.5px;
  }

  &__logos {
    @apply flex items-center justify-center gap-12 flex-wrap;
    opacity: 0.7;
  }

  &__company {
    @apply inline-flex items-center gap-2 text-sm font-semibold text-gray-400;
  }
}
</style>
