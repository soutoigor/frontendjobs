<template>
	<header class="job-opportunity-content-header">
		<CompanyCard
			v-if="jobOpportunity.company"
			:company="jobOpportunity.company"
		>
			<template #title>
				<div class="job-opportunity-content-header__titles">
					<h1
						class="job-opportunity-content-header__title"
						v-text="jobOpportunity.title"
					/>
					<h2 v-text="jobOpportunity.company?.name" />
				</div>
			</template>

			<template #action>
				<JobOpportunityCta
					class="job-opportunity-content-header__cta"
					:job-opportunity="jobOpportunity"
				/>
			</template>
		</CompanyCard>

		<div class="job-opportunity-content-header__tags-container">
			<div class="job-opportunity-content-header__tags">
				<UBadge
					v-if="jobOpportunity.salary_minimum"
					color="gray"
					:label="getSalaryText(
						jobOpportunity.currency,
						jobOpportunity.salary_minimum,
						jobOpportunity.salary_maximum,
					)"
				/>
				<UBadge
					v-if="jobOpportunity.location"
					:color="locationColor"
					:label="jobOpportunity.location"
				/>
				<UBadge
					v-for="employmentType of jobOpportunity.employment_type"
					color="white"
					:label="employmentType"
				/>
				<UBadge
					v-if="jobOpportunity.remote"
					color="green"
					label="Remote"
				/>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { getSalaryText } from '~/utils/global';
import JobOpportunityCta from '~/components/job-opportunities/job-opportunity-cta.vue';
import CompanyCard from '~/components/companies/company-card.vue';
import type { JobOpportunityDraft } from '~/types/job-opportunities';

interface Props {
	jobOpportunity: JobOpportunityDraft;
}

const props = defineProps<Props>();
const breakpoints = useBreakpoints(breakpointsTailwind);

const locationColor = computed(() => (
	props.jobOpportunity.location?.toLowerCase() === 'worldwide'
		? 'blue'
		: 'white'
));
</script>

<style scoped>
.job-opportunity-content-header {
	@apply w-full flex flex-col gap-4;

	&__title-wrapper {
		@apply w-full flex md:flex-row flex-col items-center justify-between gap-4;
	}

	&__titles {
		@apply flex flex-col gap-1;

		h2 {
			@apply text-lg font-light text-gray-400;
		}
	}

	&__title {
		@apply w-full md:text-6xl text-4xl font-light;
		flex: 2;
	}

	&__cta {
		@apply hidden md:flex md:justify-end;
	}

	&__company {
		@apply flex flex-col items-center md:items-end md:flex-row-reverse gap-1;

	}

	&__tags-container {
		@apply flex flex-col-reverse md:flex-row items-start md:items-end gap-4 justify-between;
	}

	&__tags {
		@apply flex items-end justify-center md:justify-start gap-2 flex-wrap;
	}
}
</style>
