<template>
	<header class="job-opportunity-content-header">
		<div class="job-opportunity-content-header__title-wrapper">
			<h1
				class="job-opportunity-content-header__title"
				v-text="store.jobOpportunity.title"
			/>

			<JobOpportunityCta
				v-if="breakpoints.isGreaterOrEqual('md')"
				class="job-opportunity-content-header__cta"
			/>
		</div>

		<div class="job-opportunity-content-header__tags-container">
			<JobOpportunityCta v-if="breakpoints.isSmallerOrEqual('sm')" />

			<div class="job-opportunity-content-header__tags">
				<UBadge
					v-if="store.jobOpportunity.salary_minimum"
					color="gray"
					:label="getSalaryText(
						store.jobOpportunity.currency,
						store.jobOpportunity.salary_minimum,
						store.jobOpportunity.salary_maximum,
					)"
				/>
				<UBadge
					v-if="store.jobOpportunity.location"
					:color="locationColor"
					:label="store.jobOpportunity.location"
				/>
				<UBadge
					v-if="store.jobOpportunity.employment_type"
					color="white"
					:label="store.jobOpportunity.employment_type[0]"
				/>
				<UBadge
					v-if="store.jobOpportunity.remote"
					color="green"
					label="Remote"
				/>
			</div>

			<div class="job-opportunity-content-header__company">
				<UAvatar
					v-if="store.jobOpportunity.company.avatar"
					:src="store.jobOpportunity.company.avatar"
					:alt="`${store.jobOpportunity.company.name} logo`"
					size="2xl"
				/>
				<h2 v-text="store.jobOpportunity.company.name" />
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { useJobOpportunitiesStore } from '~/store/job-opportunities';
import { getSalaryText } from '~/utils/global';
import JobOpportunityCta from '~/components/job-opportunities/job-opportunity-cta.vue';

const store = useJobOpportunitiesStore();
const breakpoints = useBreakpoints(breakpointsTailwind);

const locationColor = computed(() => (store.jobOpportunity.location?.toLowerCase() === 'worldwide' ? 'blue' : 'white'));
</script>

<style scoped>
.job-opportunity-content-header {
	@apply w-full flex flex-col gap-4;

	&__title-wrapper {
		@apply w-full flex md:flex-row flex-col items-center justify-between gap-4;
	}

	&__title {
		@apply w-full md:text-6xl md:text-start text-4xl text-center font-light;
		flex: 2;
	}

	&__cta {
		@apply flex justify-end;
		flex: 1;
	}

	&__company {
		@apply flex flex-col items-center md:items-end md:flex-row-reverse gap-1;

	}

	&__tags-container {
		@apply flex flex-col-reverse md:flex-row items-center md:items-end gap-4 justify-between;
	}

	&__tags {
		@apply flex items-end justify-center md:justify-start gap-2 flex-wrap;
	}
}
</style>
