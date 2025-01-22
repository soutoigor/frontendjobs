<template>
	<UContainer
		class="job-opportunity-card"
		as="section"
		@mouseover="setIsHovering(true)"
		@mouseleave="setIsHovering(false)"
		@click="$router.push(`/jobs/${jobOpportunity.id}`)"
	>
		<UAvatar
			:src="jobOpportunity.company.avatar"
			:alt="`${jobOpportunity.company.name} logo`"
			size="xl"
		/>
		<div class="job-opportunity-card__content-wrapper">
			<!-- Titles and Tags -->
			<div class="job-opportunity-card__main-info">
				<div class="job-opportunity-card__titles">
					<h1 v-text="jobOpportunity.title" />
					<h2 v-text="jobOpportunity.company.name" />
				</div>
				<div class="job-opportunity-card__tags">
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
						:key="employmentType"
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

			<!-- Technologies -->
			<div class="job-opportunity-card__technologies">
				<UBadge
					v-for="technology in jobOpportunity.technologies"
					:key="technology.id"
					class="job-opportunity-card__technology-badge"
					variant="soft"
					:label="technology.name"
				/>
			</div>

			<!-- Actions -->
			<div class="job-opportunity-card__actions">
				<UButton
					v-if="isHovering || breakpoints.isSmallerOrEqual('sm')"
					variant="solid"
					size="sm"
					block
					:to="`/jobs/${jobOpportunity.id}`"
				>
					View Details
				</UButton>
			</div>
		</div>

		<div class="job-opportunity-card__meta">
			<UBadge
				v-if="jobOpportunity.views"
				color="green"
				variant="soft"
				size="sm"
				:label="viewsText"
			/>

			<UBadge
				v-if="jobOpportunity.applications"
				color="yellow"
				variant="soft"
				size="sm"
				:label="applicationsText"
			/>

			<span
				v-if="jobOpportunity.date_posted"
				class="job-opportunity-card__posted-at"
				v-text="timeAgo(jobOpportunity.date_posted)"
			/>
		</div>
	</UContainer>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import type { CompanyJobOpportunity } from '~/types/companies';
import type { JobOpportunity } from '~/types/job-opportunities';
import { getSalaryText, timeAgo } from '~/utils/global';

interface Props {
	jobOpportunity: JobOpportunity | CompanyJobOpportunity;
}

const props = defineProps<Props>();

const breakpoints = useBreakpoints(breakpointsTailwind);

const isHovering = ref(false);
const locationColor = computed(() => (props.jobOpportunity.location?.toLowerCase() === 'worldwide' ? 'blue' : 'white'));
const applicationsText = computed(() => `${props.jobOpportunity.applications} ${props.jobOpportunity.applications === 1 ? 'application' : 'applications'}`);
const viewsText = computed(() => `${props.jobOpportunity.views} ${props.jobOpportunity.views === 1 ? 'view' : 'views'}`);

function setIsHovering(value: boolean) {
	isHovering.value = value;
}
</script>

<style scoped>
.job-opportunity-card {
  @apply border rounded-md w-full border-gray-600 flex gap-4 py-4 px-6 relative cursor-pointer;
	@apply transition-all duration-200 hover:shadow-sm hover:border-purple-600;
	@apply flex-col md:flex-row;

	&__content-wrapper {
		@apply flex gap-8 w-full md:items-center justify-between;
		@apply flex-col md:flex-row;
	}

	&__main-info {
		@apply flex flex-col gap-2 w-2/3;
	}

	&__titles {
		@apply flex flex-col gap-1;

		h1 {
			@apply text-lg font-semibold;
		}
	}

	&__technologies {
		@apply flex flex-wrap gap-2 w-1/5 justify-center;
	}

	&__technology-badge {
		@apply text-nowrap;
	}

	&__tags {
		@apply flex gap-2 mt-2 max-w-full flex-wrap;
	}

	&__actions {
		@apply flex justify-end items-end h-full w-full md:w-1/5 lg:w-1/4;
	}

	&__meta {
		@apply absolute right-4 top-2 flex gap-2 items-center;
	}

	&__posted-at {
		@apply text-xs;
	}
}
</style>
